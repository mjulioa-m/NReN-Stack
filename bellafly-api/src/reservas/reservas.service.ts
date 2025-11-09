import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Bloqueo } from 'src/bloqueos/entities/bloqueo.entity';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { EstadoReserva, Reserva } from './entities/reserva.entity';
import { JwtPayload } from 'src/auth/jwt-general.strategy';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
    @InjectRepository(Prestador)
    private prestadorRepository: Repository<Prestador>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(Bloqueo)
    private bloqueoRepository: Repository<Bloqueo>,
  ) {}

  async create(createReservaDto: CreateReservaDto, cliente: Cliente) {
    const { servicioId, fechaInicio } = createReservaDto;

    const servicio = await this.servicioRepository.findOne({
      where: { id: servicioId },
      relations: ['prestador'],
    });
    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }
    const prestador = servicio.prestador;

    // 1b. Calcular las horas de inicio y fin de la cita (en UTC). Siempre todo se guardara en UTC
    const fechaInicioDate = new Date(fechaInicio);
    const duracion = servicio.duracion; // en minutos
    const fechaFinDate = new Date(fechaInicioDate.getTime() + duracion * 60000);

    // 2a.  ¿Está DENTRO del horario laboral?. Que deberia ser todo el dia pero bueno
    await this.checkDisponibilidadHorario(
      prestador,
      fechaInicioDate,
      fechaFinDate,
    );

    // 2b. ¿La cita se SOLAPA con un bloqueo o con otra reserva?. Para revisar que no este almorzando el vale
    await this.checkSolapamiento(prestador, fechaInicioDate, fechaFinDate);

    // --- PASO 3: Si pasó todas las validaciones, crear la reserva ---
    const nuevaReserva = this.reservaRepository.create({
      cliente: cliente,
      prestador: prestador,
      servicio: servicio,
      fechaInicio: fechaInicioDate,
      fechaFin: fechaFinDate,
      estado: EstadoReserva.PENDIENTE, // Inicia como 'pendiente'. Por si al prestador se le olvio que a esa hora tiene un mandado que hacer y la cancela
    });

    await this.reservaRepository.save(nuevaReserva);
    return nuevaReserva;
  }

  private async checkDisponibilidadHorario(
    prestador: Prestador,
    fechaInicio: Date,
    fechaFin: Date,
  ) {
    const diaDeSemana = fechaInicio.getUTCDay();

    const horariosDelDia = await this.horarioRepository.find({
      where: {
        prestador: { id: prestador.id },
        diaDeSemana: diaDeSemana,
        estaActivo: true,
      },
    });

    if (!horariosDelDia.length) {
      throw new BadRequestException(
        'El prestador no trabaja ese día de la semana',
      );
    }

    const horaInicioSolicitada =
      fechaInicio.getUTCHours() * 60 + fechaInicio.getUTCMinutes();

    let horaFinSolicitada =
      fechaFin.getUTCHours() * 60 + fechaFin.getUTCMinutes();
    if (horaFinSolicitada === 0) horaFinSolicitada = 24 * 60;

    const estaDentroDelHorario = horariosDelDia.some((horario) => {
      const [hInicio, mInicio] = horario.horaInicio.split(':').map(Number);
      const [hFin, mFin] = horario.horaFin.split(':').map(Number);

      let inicioHorarioMinutos = hInicio * 60 + mInicio;
      let finHorarioMinutos = hFin * 60 + mFin;
      if (finHorarioMinutos === 0) finHorarioMinutos = 24 * 60;

      return (
        horaInicioSolicitada >= inicioHorarioMinutos &&
        horaFinSolicitada <= finHorarioMinutos
      );
    });

    if (!estaDentroDelHorario) {
      throw new BadRequestException(
        'La cita está fuera del horario laboral del prestador',
      );
    }
  }

  /**
   * CAPA 2 y 3: Verifica si la cita se solapa (choca) con
   * un bloqueo existente o con otra reserva.
   */
  private async checkSolapamiento(
    prestador: Prestador,
    fechaInicio: Date,
    fechaFin: Date,
  ) {
    // Lógica de solapamiento:
    // Un evento (A) se solapa con otro (B) si:
    // (A.inicio < B.fin) Y (A.fin > B.inicio)

    // 2b. CAPA 2: Buscar Bloqueos
    const bloqueosSolapados = await this.bloqueoRepository.count({
      where: {
        prestador: { id: prestador.id },
        fechaInicio: LessThan(fechaFin), // Bloqueo.inicio < Cita.fin
        fechaFin: MoreThan(fechaInicio), // Bloqueo.fin > Cita.inicio
      },
    });

    if (bloqueosSolapados > 0) {
      throw new BadRequestException(
        'El prestador tiene un bloqueo personal en ese horario',
      );
    }

    // 2c. CAPA 3: Buscar Reservas
    const reservasSolapadas = await this.reservaRepository.count({
      where: {
        prestador: { id: prestador.id },
        // Solo contamos las que no estén canceladas o completadas
        estado: In([EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA]),
        fechaInicio: LessThan(fechaFin), // Reserva.inicio < Cita.fin
        fechaFin: MoreThan(fechaInicio), // Reserva.fin > Cita.inicio
      },
    });

    if (reservasSolapadas > 0) {
      throw new BadRequestException(
        'El prestador ya tiene una cita en ese horario',
      );
    }
  }

  async findMisReservas(cliente: Cliente) {
    return this.reservaRepository.find({
      where: {
        cliente: { id: cliente.id },
      },
      relations: ['prestador', 'servicio'],
      order: {
        fechaInicio: 'DESC',
      },
    });
  }

  async findMisCitas(prestador: Prestador) {
    return this.reservaRepository.find({
      where: {
        prestador: { id: prestador.id }, // Filtra por el ID del prestador
      },
      // ¡Clave! Cargamos los detalles del cliente y del servicio
      relations: ['cliente', 'servicio'],
      order: {
        fechaInicio: 'ASC', // Muestra las más próximas primero
      },
    });
  }
  async confirmarReserva(idReserva: string, prestador: Prestador) {
    // 1. Buscar la reserva
    const reserva = await this.reservaRepository.findOne({
      where: { id: idReserva },
      relations: ['prestador'], // Cargar la relación del prestador
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // 2. Verificar Permiso: ¿Es el prestador correcto?
    if (reserva.prestador.id !== prestador.id) {
      throw new UnauthorizedException(
        'No tienes permiso para confirmar esta reserva',
      );
    }

    // 3. Verificar Lógica de Estado: ¿Está 'pendiente'?
    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      throw new BadRequestException(
        `Solo se pueden confirmar reservas en estado "pendiente". Estado actual: ${reserva.estado}`,
      );
    }

    // 4. Actualizar el estado y guardar
    reserva.estado = EstadoReserva.CONFIRMADA;
    await this.reservaRepository.save(reserva);

    return reserva;
  }

  async cancelarReserva(idReserva: string, userPayload: JwtPayload) {
    // 1. Buscar la reserva con sus dueños
    const reserva = await this.reservaRepository.findOne({
      where: { id: idReserva },
      relations: ['prestador', 'cliente'], // ¡Clave! Cargar ambos
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // 2. Verificar Permiso: ¿Es el cliente o el prestador de esta reserva?
    const esClienteDueño =
      userPayload.rol === 'cliente' && reserva.cliente.id === userPayload.sub;

    const esPrestadorDueño =
      userPayload.rol === 'prestador' &&
      reserva.prestador.id === userPayload.sub;

    if (!esClienteDueño && !esPrestadorDueño) {
      throw new UnauthorizedException(
        'No tienes permiso para cancelar esta reserva',
      );
    }

    // 3. Verificar Lógica de Estado: ¿Está 'pendiente' o 'confirmada'?
    if (
      reserva.estado === EstadoReserva.CANCELADA ||
      reserva.estado === EstadoReserva.COMPLETADA
    ) {
      throw new BadRequestException(
        `Esta reserva ya no puede ser cancelada (estado: ${reserva.estado})`,
      );
    }

    // 4. Actualizar el estado y guardar
    reserva.estado = EstadoReserva.CANCELADA;
    reserva.canceladaPor = userPayload.rol;
    await this.reservaRepository.save(reserva);

    return reserva;
  }

  async completarReserva(idReserva: string, prestador: Prestador) {
    // 1. Buscar la reserva
    const reserva = await this.reservaRepository.findOne({
      where: { id: idReserva },
      relations: ['prestador'], // Cargar la relación del prestador
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // 2. Verificar Permiso: ¿Es el prestador correcto?
    if (reserva.prestador.id !== prestador.id) {
      throw new UnauthorizedException(
        'No tienes permiso para completar esta reserva',
      );
    }

    // 3. Verificar Lógica de Estado: ¿Está 'confirmada'?
    if (reserva.estado !== EstadoReserva.CONFIRMADA) {
      throw new BadRequestException(
        `Solo se pueden completar reservas en estado "confirmada". Estado actual: ${reserva.estado}`,
      );
    }

    // 4. Actualizar el estado y guardar
    reserva.estado = EstadoReserva.COMPLETADA;
    await this.reservaRepository.save(reserva);

    return reserva;
  }
}
