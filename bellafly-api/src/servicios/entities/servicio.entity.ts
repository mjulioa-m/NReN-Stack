import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Para dinero
  precio: number;

  @Column('int') // Duración en minutos
  duracion: number;

  // --- ¡AQUÍ ESTÁ LA RELACIÓN! ---
  @ManyToOne(
    () => Prestador, // La entidad con la que se relaciona
    (prestador) => prestador.servicios, // El campo en la otra tabla (que aún no creamos)
    { eager: false }, // No cargar el prestador automáticamente
  )
  prestador: Prestador;
}
