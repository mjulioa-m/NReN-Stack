import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Reseña } from 'src/reseñas/entities/reseña.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

// Definimos los posibles estados de una reserva
export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Conexión con Cliente ---
  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, {
    onDelete: 'SET NULL', // Si se borra el cliente, la reserva queda (anónima)
  })
  cliente: Cliente;

  // --- Conexión con Prestador ---
  @ManyToOne(() => Prestador, (prestador) => prestador.reservas, {
    onDelete: 'CASCADE', // Si se borra el prestador, se borran sus reservas
  })
  prestador: Prestador;

  // --- Conexión con Servicio ---
  @ManyToOne(() => Servicio, (servicio) => servicio.reservas, {
    onDelete: 'SET NULL', // Si se borra el servicio, la reserva queda
  })
  servicio: Servicio;

  // --- Detalles de la Cita ---
  @Column({ type: 'timestamptz' }) // Fecha y hora de inicio (ej: 20 Nov 10:00)
  fechaInicio: Date;

  @Column({ type: 'timestamptz' }) // Fecha y hora de fin (ej: 20 Nov 11:00)
  fechaFin: Date;

  // --- Estado de la Cita ---
  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado: EstadoReserva;

  // --- Auditoría ---
  @CreateDateColumn()
  creadaEn: Date;

  @UpdateDateColumn()
  actualizadaEn: Date;

  @Column({ type: 'varchar', nullable: true })
  canceladaPor: string | null;

  @OneToOne(() => Reseña, (reseña) => reseña.reserva)
  reseña: Reseña; // Una reserva solo puede tener una reseña
}
