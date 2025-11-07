import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Servicio } from './servicio.entity'; // Importa la entidad principal

@Entity()
export class FotoServicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // Aquí guardaremos la URL segura de Cloudinary
  url: string;

  @Column({ nullable: true })
  descripcion: string;

  // --- Relación: Muchas fotos pertenecen a UN servicio ---
  @ManyToOne(
    () => Servicio,
    (servicio) => servicio.fotos, // El campo en la otra tabla (que haremos ahora)
    { onDelete: 'CASCADE' }, // Si se borra el servicio, se borran sus fotos
  )
  servicio: Servicio;
}
