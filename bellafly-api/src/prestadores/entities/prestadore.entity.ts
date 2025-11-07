import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Servicio } from 'src/servicios/entities/servicio.entity'; // <-- 1. Importar

@Entity() // Le dice a TypeORM que esto es una tabla
export class Prestador {
  @PrimaryGeneratedColumn('uuid') // ID único automático
  id: string;

  @Column({ unique: true }) // El email debe ser único
  email: string;

  @Column()
  nombre: string;

  @Column({ select: false }) // No se incluye en las consultas por defecto
  password: string; // Aquí se guarda el hash de bcrypt

  // --- 3. AÑADIR ESTE CAMPO ---
  @OneToMany(
    () => Servicio, // La entidad con la que se relaciona
    (servicio) => servicio.prestador, // El campo en la otra tabla
  )
  servicios: Servicio[]; // Un prestador puede tener un array de servicios
}
