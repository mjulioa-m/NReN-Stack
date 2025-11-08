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
      const upload = this.cloudinarySdk.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'servicios', // Opcional: para organizar en Cloudinary. ponlo o vuelvete loco
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
  async findFotosByServicio(idServicio: string) {
    // 1. Primero, verificamos que el servicio (padre) exista. porque sino da error perro
    const servicio = await this.servicioRepository.findOneBy({
      id: idServicio,
    });

    if (!servicio) {
      throw new NotFoundException(
        `Servicio con ID "${idServicio}" no encontrado`,
      );
    }

    // 2. Si existe, buscamos todas las fotos asociadas a él
    const fotos = await this.fotoServicioRepository.find({
      where: {
        servicio: {
          id: idServicio,
        },
      },
      select: ['id', 'url', 'descripcion'], // Solo devolvemos lo necesario, porque no te interesa mas nada, sapo
    });

    return fotos;
  }

  async removeFoto(idServicio: string, idFoto: string, prestador: Prestador) {
    await this.findOne(idServicio, prestador);

    // 2. Buscar la foto específica que queremos borrar. porque si la cagas, pierdes
    const foto = await this.fotoServicioRepository.findOne({
      where: {
        id: idFoto,
        servicio: { id: idServicio },
      },
    });

    if (!foto) {
      throw new NotFoundException(
        `Foto con ID "${idFoto}" no encontrada en este servicio`,
      );
    }

    try {
      const publicId = this.extractPublicIdFromUrl(foto.url);

      await this.cloudinarySdk.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al borrar de Cloudinary:', error);
      // throw new InternalServerErrorException('Error al borrar la imagen de Cloudinary'); pero te recomiendo que si esa vaina esta caida por alguna razon sigas para adelante y borres la url de la base de datos, si no lo quieres hacer asi activa esta funcion y suerte contigo.
    }

    // 4. Borrar la foto de nuestra base de datos. 20/10 hay q hacerlo si o si aunque lo otro falle. y si no te gusta haz un fork y cambialo sapo
    await this.fotoServicioRepository.remove(foto);

    return { message: 'Foto eliminada exitosamente' };
  }
  //te estabas preguntado ese metodo raro que era? bueno es para poder poner bien las urls y borrar lo que es y donde es
  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const folder = parts[parts.length - 2];
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0]; // Quitar .jpg/.png o videos si tienes, deberia de funcionar tambien todo esto para videos pero no lo he probado, pruebelo usted para ver si sirve pa algo

    return `${folder}/${publicId}`;
  }
}
