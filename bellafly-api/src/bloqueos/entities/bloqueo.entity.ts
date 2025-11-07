import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Bloqueo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Guarda la fecha Y la hora exactas del inicio (ej: 20 Nov 10:00)
  @Column({ type: 'timestamptz' })
  fechaInicio: Date;

  // Guarda la fecha Y la hora exactas del fin (ej: 20 Nov 11:00)
  @Column({ type: 'timestamptz' })
  fechaFin: Date;

  @Column({ nullable: true }) // El motivo es opcional. Nos interesa que labure ya si falta es problema de el
  motivo: string; // Ej: "Dentista", "Vacaciones"

  @ManyToOne(
    () => Prestador,
    (prestador) => prestador.bloqueos,
    { onDelete: 'CASCADE' }, // Si se borra el prestador, se borran sus bloqueos. De one
  )
  prestador: Prestador;
}
