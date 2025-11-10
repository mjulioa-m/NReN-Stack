import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Reseña {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- La Reseña ---
  @Column('int') // 1, 2, 3, 4, o 5
  calificacion: number;

  @Column({ type: 'text', nullable: true }) // El texto es opcional
  comentario: string | null;

  // --- Relación 1-a-1 con Reserva ---
  @OneToOne(() => Reserva, (reserva) => reserva.reseña, {
    onDelete: 'CASCADE', // Si se borra la reserva, se borra la reseña
  })
  @JoinColumn() // Esto pone la 'reservaId' en esta tabla
  reserva: Reserva;

  // --- Relaciones de conveniencia (para buscar fácil) ---
  @ManyToOne(() => Cliente)
  cliente: Cliente;

  @ManyToOne(() => Prestador)
  prestador: Prestador;

  @CreateDateColumn()
  creadaEn: Date;
}
