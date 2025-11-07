import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Repository } from 'typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { UpdateServicioDto } from './dto/update-servicio.dto';
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
}
