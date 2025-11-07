import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Repository } from 'typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Servicio } from './entities/servicio.entity';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
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
}
