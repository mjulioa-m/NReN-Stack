import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { CLOUDINARY } from 'src/cloudinary/cloudinary.provider';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import * as stream from 'stream';
@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private jwtService: JwtService,
    @Inject(CLOUDINARY)
    private cloudinarySdk: typeof cloudinary,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const { nombre, email, password } = createClienteDto;

    const clienteExistente = await this.clienteRepository.findOneBy({ email });
    if (clienteExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    const salt = await bcrypt.genSalt();
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoCliente = this.clienteRepository.create({
      nombre,
      email,
      password: passwordHasheada,
    });

    const clienteGuardado = await this.clienteRepository.save(nuevoCliente);

    const { password: _, ...resultado } = clienteGuardado;
    return resultado;
  }
  async login(loginClienteDto: LoginClienteDto) {
    const { email, password } = loginClienteDto;

    const cliente = await this.clienteRepository.findOne({
      where: { email },
      select: ['id', 'email', 'nombre', 'password'],
    });

    if (!cliente) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparar la contraseña enviada con el hash de la BD
    const esPasswordCorrecta = await bcrypt.compare(password, cliente.password);

    if (!esPasswordCorrecta) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    //
    const payload = {
      sub: cliente.id,
      email: cliente.email,
      rol: 'cliente', // ¡MUY IMPORTANTE para diferenciarlo del prestador!
    };

    // Firmar y devolver el token
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      accessToken,
    };
  }

  async getPerfil(clienteId: string) {
    const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async updatePerfil(clienteId: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.getPerfil(clienteId);

    Object.assign(cliente, updateClienteDto);

    return this.clienteRepository.save(cliente);
  }

  async removePerfil(clienteId: string) {
    const cliente = await this.getPerfil(clienteId);
    await this.clienteRepository.remove(cliente);
    return { message: 'Cliente eliminado exitosamente' };
  }

  async uploadFotoPerfil(clienteId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha enviado ningún archivo');
    }

    // A. Buscar el cliente para asegurar que existe
    const cliente = await this.getPerfil(clienteId);

    // B. Subir el archivo a Cloudinary
    let uploadResult: UploadApiResponse;
    try {
      uploadResult = await this.uploadToCloudinary(file);
    } catch (error) {
      throw new BadRequestException(
        `Error al subir la imagen: ${error.message}`,
      );
    }

    // C. Actualizar la URL de la foto de perfil del cliente
    cliente.urlFotoPerfil = uploadResult.secure_url;
    await this.clienteRepository.save(cliente);

    // D. Devolver la URL
    return { urlFotoPerfil: cliente.urlFotoPerfil };
  }

  // --- 7. AÑADIR ESTE MÉTODO HELPER PRIVADO (Copiado del de servicios) ---
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinarySdk.uploader.upload_stream(
        {
          resource_type: 'auto', // Detecta si es imagen o video
          folder: 'clientes', // <-- ¡Importante! Carpeta 'clientes' en Cloudinary
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new Error(
                'Fallo la subida a Cloudinary, no se recibió resultado.',
              ),
            );
          }
          resolve(result);
        },
      );
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(upload);
    });
  }
  async deleteFotoPerfil(clienteId: string) {
    const cliente = await this.getPerfil(clienteId);

    if (!cliente.urlFotoPerfil) {
      return { message: 'No hay foto de perfil para eliminar' };
    }

    try {
      const publicId = this.extractPublicIdFromUrl(cliente.urlFotoPerfil);

      await this.cloudinarySdk.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al borrar de Cloudinary:', error);
    }

    // Borrar la referencia en nuestra BD. Siempre aunque lo otro falle
    cliente.urlFotoPerfil = null;
    await this.clienteRepository.save(cliente);

    return { message: 'Foto de perfil eliminada exitosamente' };
  }

  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');

    // Asumimos que la carpeta es 'clientes'. Si no la que se te de la gana
    const folder = 'clientes';
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];

    return `${folder}/${publicId}`;
  }
}
