import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrestadorDto } from './dto/create-prestadore.dto';
import { Prestador } from './entities/prestadore.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginPrestadorDto } from './dto/login-prestador.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { CLOUDINARY } from 'src/cloudinary/cloudinary.provider';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import * as stream from 'stream';
@Injectable()
export class PrestadoresService {
  constructor(
    @InjectRepository(Prestador)
    private prestadorRepository: Repository<Prestador>,
    private jwtService: JwtService,
    @Inject(CLOUDINARY)
    private cloudinarySdk: typeof cloudinary,
  ) {}

  async create(createPrestadorDto: CreatePrestadorDto) {
    const { nombre, email, password } = createPrestadorDto;

    // 3. Revisar si el email ya existe
    const prestadorExistente = await this.prestadorRepository.findOneBy({
      email,
    });
    if (prestadorExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    // 4. Hashear la contraseña. La seguridad primero q estamos en LATAM
    const salt = await bcrypt.genSalt();
    const passwordHasheada = await bcrypt.hash(password, salt);

    // 5. Crear la nueva entidad
    const nuevoPrestador = this.prestadorRepository.create({
      nombre,
      email,
      password: passwordHasheada,
    });

    // 6. Guardar en la base de datos
    const prestadorGuardado =
      await this.prestadorRepository.save(nuevoPrestador);

    const { password: _, ...resultado } = prestadorGuardado;

    return resultado;
  }

  async login(loginPrestadorDto: LoginPrestadorDto) {
    const { email, password } = loginPrestadorDto;

    const prestador = await this.prestadorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'nombre', 'password'],
    });

    if (!prestador) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // B. Comparar la contraseña enviada con el hash de la BD
    const esPasswordCorrecta = await bcrypt.compare(
      password,
      prestador.password,
    );

    if (!esPasswordCorrecta) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // C. Si todo es correcto, crear el Token (Payload)
    const payload = {
      sub: prestador.id, // 'sub' es el estándar para el ID de usuario. según gemini, lo deje porque es corto
      email: prestador.email,
      rol: 'prestador',
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      accessToken,
    };
  }

  async updatePerfil(prestadorId: string, updatePerfilDto: UpdatePerfilDto) {
    const prestador = await this.prestadorRepository.findOneBy({
      id: prestadorId,
    });

    if (!prestador) {
      throw new NotFoundException('Prestador no encontrado');
    }

    Object.assign(prestador, updatePerfilDto);

    const prestadorActualizado = await this.prestadorRepository.save(prestador);

    const { password: _, ...resultado } = prestadorActualizado;
    return resultado;
  }

  async uploadFotoPerfil(prestadorId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha enviado ningún archivo');
    }

    const prestador = await this.prestadorRepository.findOneBy({
      id: prestadorId,
    });
    if (!prestador) {
      throw new NotFoundException('Prestador no encontrado');
    }

    let uploadResult: UploadApiResponse;
    try {
      uploadResult = await this.uploadToCloudinary(file);
    } catch (error) {
      throw new BadRequestException(
        `Error al subir la imagen: ${error.message}`,
      );
    }

    prestador.urlFotoPerfil = uploadResult.secure_url;
    await this.prestadorRepository.save(prestador);

    return { urlFotoPerfil: prestador.urlFotoPerfil };
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinarySdk.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'prestadores',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Fallo la subida a Cloudinary'));
          resolve(result);
        },
      );
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(upload);
    });
  }

  async deleteFotoPerfil(prestadorId: string) {
    const prestador = await this.prestadorRepository.findOneBy({
      id: prestadorId,
    });
    if (!prestador) {
      throw new NotFoundException('Prestador no encontrado');
    }

    if (!prestador.urlFotoPerfil) {
      return { message: 'No hay foto de perfil para eliminar' };
    }

    try {
      const publicId = this.extractPublicIdFromUrl(prestador.urlFotoPerfil);

      await this.cloudinarySdk.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al borrar de Cloudinary:', error);
    }

    prestador.urlFotoPerfil = null;
    await this.prestadorRepository.save(prestador);

    return { message: 'Foto de perfil eliminada exitosamente' };
  }

  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');

    const folder = 'prestadores';
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];

    return `${folder}/${publicId}`;
  }
}
