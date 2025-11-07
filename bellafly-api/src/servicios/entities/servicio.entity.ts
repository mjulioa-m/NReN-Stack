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

  @Column('decimal', { precision: 10, scale: 2 }) // Para dinero, plata, money. Lo que no generamos con codigos abiertos :(
  precio: number;

  @Column('int') // Duración en minutos.Si quieres usar horas o dias ya cambialo tú.
  duracion: number;

  @ManyToOne(
    () => Prestador, // La entidad con la que se relaciona
    (prestador) => prestador.servicios,
    { eager: false }, // No cargar el prestador automáticamente
  )
  prestador: Prestador;
}
