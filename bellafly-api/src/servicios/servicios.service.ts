import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Repository } from 'typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { FotoServicio } from './entities/foto-servicio.entity';
import { CLOUDINARY } from 'src/cloudinary/cloudinary.provider';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as stream from 'stream';
@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,

    @InjectRepository(FotoServicio)
    private fotoServicioRepository: Repository<FotoServicio>,

    @Inject(CLOUDINARY)
    private cloudinarySdk: typeof cloudinary,
  ) {}

  async create(createServicioDto: CreateServicioDto, prestador: Prestador) {
    const { nombre, descripcion, precio, duracion } = createServicioDto;

    const nuevoServicio = this.servicioRepository.create({
      nombre,
      descripcion,
      precio,
      duracion,
      prestador: prestador,
    });

    await this.servicioRepository.save(nuevoServicio);

    const { prestador: _, ...resultado } = nuevoServicio;

    return resultado;
  }
  async findAll(prestador: Prestador) {
    const servicios = await this.servicioRepository.find({
      where: {
        prestador: {
          id: prestador.id,
        },
      },
    });

    return servicios;
  }
  async findOne(id: string, prestador: Prestador) {
    const servicio = await this.servicioRepository.findOne({
      where: {
        id: id,
        prestador: {
          id: prestador.id,
        },
      },
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio con ID "${id}" no encontrado`);
    }

    return servicio;
  }

  async update(
    id: string,
    updateServicioDto: UpdateServicioDto,
    prestador: Prestador,
  ) {
    const servicio = await this.findOne(id, prestador);

    Object.assign(servicio, updateServicioDto);

    return this.servicioRepository.save(servicio);
  }

  async remove(id: string, prestador: Prestador) {
    //Reutilizamos 'findOne' para encontrar el servicio, hay que reutilizar pa, para eso creamos servicios
    const servicio = await this.findOne(id, prestador);

    await this.servicioRepository.remove(servicio);

    // Devolvemos un mensaje con el objeto borrado para que en algun momento del 2030 que hagamos el front este pueda decir que tal elemento fue borrado, o algo asi se me ocurrio ahora
    return {
      message: 'Servicio eliminado exitosamente',
      servicioBorrado: servicio,
    };
  }

  async addFoto(
    idServicio: string,
    prestador: Prestador,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha enviado ningún archivo');
    }

    // 1. Verificar que el servicio existe y es del prestador
    //    ¡Reutilizamos la lógica que ya hicimos!
    const servicio = await this.findOne(idServicio, prestador);

    // 2. Subir el archivo a Cloudinary (usando un helper)
    let uploadResult: UploadApiResponse;
    try {
      uploadResult = await this.uploadToCloudinary(file);
    } catch (error) {
      throw new BadRequestException(
        `Error al subir la imagen: ${error.message}`,
      );
    }

    // 3. Crear la entidad FotoServicio con la URL
    const newFoto = this.fotoServicioRepository.create({
      url: uploadResult.secure_url,
      servicio: servicio,
    });

    // 4. Guardar en la BD
    await this.fotoServicioRepository.save(newFoto);

    return newFoto;
  }

  // --- 8. AÑADIR ESTE MÉTODO HELPER PRIVADO ---
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Usamos upload_stream para subir desde un buffer
      const upload = this.cloudinarySdk.uploader.upload_stream(
        {
          resource_type: 'auto', // Detecta si es imagen o video
          folder: 'servicios', // Opcional: para organizar en Cloudinary
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
      // Convertimos el buffer del archivo en un stream legible y lo pasamos
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(upload);
    });
  }
}
