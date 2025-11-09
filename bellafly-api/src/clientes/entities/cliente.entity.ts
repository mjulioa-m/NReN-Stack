import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reserva } from 'src/reservas/entities/reserva.entity';
@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // No devolverla en las consultas
  password: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true }) // Guardaremos la URL de la foto (de Cloudinary, etc.)
  urlFotoPerfil: string | null;

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Reserva[];
}
