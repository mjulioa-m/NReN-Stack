import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Repository, EntityManager } from 'typeorm';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { Horario } from './entities/horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    private entityManager: EntityManager,
  ) {}

  async definirHorario(
    horariosDto: CreateHorarioDto[], // Recibimos un ARRAY de franjas ya que el cole tiene que trabajar todos los dias no solo uno
    prestador: Prestador,
  ) {
    return this.entityManager.transaction(async (manager) => {
      // Borrar todas las reglas de horario antiguas. Para que llamar un endpoint que borre y despues este que guarde el nuevo horario? Eres estupido?
      await manager.delete(Horario, { prestador: { id: prestador.id } });

      // Crear las nuevas reglas
      const nuevosHorarios = horariosDto.map((dto) => {
        return manager.create(Horario, {
          ...dto,
          prestador: prestador,
        });
      });

      // Guardar todas las nuevas reglas a la vez. De one
      await manager.save(Horario, nuevosHorarios);

      return nuevosHorarios;
    });
  }

  // 8. También creamos un 'findAll' para que el prestador vea su horario, para que vea que tiene q laburar y darnos plata,money,guita
  findAll(prestador: Prestador) {
    return this.horarioRepository.find({
      where: { prestador: { id: prestador.id } },
      order: { diaDeSemana: 'ASC', horaInicio: 'ASC' }, // Ordenado
    });
  }
}
