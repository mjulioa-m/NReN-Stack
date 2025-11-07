import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Repository } from 'typeorm';
import { CreateBloqueoDto } from './dto/create-bloqueo.dto';
import { Bloqueo } from './entities/bloqueo.entity';

@Injectable()
export class BloqueosService {
  constructor(
    @InjectRepository(Bloqueo)
    private bloqueoRepository: Repository<Bloqueo>,
  ) {}

  async create(createBloqueoDto: CreateBloqueoDto, prestador: Prestador) {
    const nuevoBloqueo = this.bloqueoRepository.create({
      ...createBloqueoDto,
      prestador: prestador,
    });

    await this.bloqueoRepository.save(nuevoBloqueo);
    return nuevoBloqueo;
  }

  findAll(prestador: Prestador) {
    return this.bloqueoRepository.find({
      where: { prestador: { id: prestador.id } },
      order: { fechaInicio: 'ASC' },
    });
  }

  async remove(id: string, prestador: Prestador) {
    const bloqueo = await this.bloqueoRepository.findOne({
      where: {
        id: id,
        prestador: { id: prestador.id },
      },
    });

    if (!bloqueo) {
      throw new NotFoundException(`Bloqueo con ID "${id}" no encontrado`);
    }

    // AQUI NO PONGO COMENTARIOS PORQUE EL HECHO DE QUE PONGAN BLOQUEOS A LOS HORARIOS Y NO LABUREN ME AZARA
    await this.bloqueoRepository.remove(bloqueo);
    return { message: 'Bloqueo eliminado exitosamente' };
  }
}
