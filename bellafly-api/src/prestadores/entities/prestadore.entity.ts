import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Servicio } from 'src/servicios/entities/servicio.entity'; // <-- 1. Importar

@Entity()
export class Prestador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // El email debe ser único, claramente pa
  email: string;

  @Column()
  nombre: string;

  @Column({ select: false }) // No se incluye en las consultas por defecto, sino nos hackean
  password: string; // Aquí se guarda el hash de bcrypt, porque las contraseñas no se guardan en plano, crack

  @OneToMany(
    () => Servicio,
    (servicio) => servicio.prestador, // El campo en la otra tabla
  )
  servicios: Servicio[]; // Un prestador puede tener un array de servicios, si solo tiene uno se muere de hambre,(inserte chiste xenofobo)
}
