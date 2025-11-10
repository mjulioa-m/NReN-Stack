import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { EstadoReserva, Reserva } from 'src/reservas/entities/reserva.entity';
import { Repository } from 'typeorm';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { Reseña } from './entities/reseña.entity';

@Injectable()
export class ReseñasService {
  constructor(
    @InjectRepository(Reseña)
    private reseñaRepository: Repository<Reseña>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  // --- LÓGICA DE CREAR RESEÑA ---
  async create(createReseñaDto: CreateReseñaDto, cliente: Cliente) {
    const { reservaId, calificacion, comentario } = createReseñaDto;

    // 1. Buscar la reserva y sus relaciones
    const reserva = await this.reservaRepository.findOne({
      where: { id: reservaId },
      relations: ['cliente', 'prestador', 'reseña'], // ¡Clave! Cargar todo
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // 2. Regla de Negocio: ¿Es tu reserva?
    if (reserva.cliente.id !== cliente.id) {
      throw new UnauthorizedException('No puedes calificar esta reserva');
    }

    // 3. Regla de Negocio: ¿Está completada?
    if (reserva.estado !== EstadoReserva.COMPLETADA) {
      throw new BadRequestException(
        'Solo puedes calificar reservas "completadas"',
      );
    }

    // 4. Regla de Negocio: ¿Ya fue calificada?
    if (reserva.reseña) {
      throw new BadRequestException('Esta reserva ya ha sido calificada');
    }

    // 5. ¡Todo en orden! Crear la reseña
    const nuevaReseña = this.reseñaRepository.create({
      calificacion,
      comentario,
      reserva: reserva,
      cliente: cliente,
      prestador: reserva.prestador, // Guardamos el prestador para búsquedas fáciles
    });

    return this.reseñaRepository.save(nuevaReseña);
  }

  // ... (findAll, findOne, etc. que generó el CLI)
}
