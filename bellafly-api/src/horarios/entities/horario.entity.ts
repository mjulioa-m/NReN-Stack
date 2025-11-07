import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity()
// @Index(['prestador', 'diaDeSemana'], { unique: true }) // Un prestador solo puede tener una regla por día, es cule peo no poner esto y hacer horarios partidos pero si se hace algo que se haga bien, sino seriamos...(el que haga una PR llenando el chiste se la acepto de una aunque meta una puerta trasera)
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Usaremos números para los días: 0=Domingo, 1=Lunes, 2=Martes, etc. porque sino nos volvemos locos
  @Column('int')
  diaDeSemana: number;

  @Column({ default: true })
  estaActivo: boolean; // Para que el prestador pueda "prender/apagar" un día. Yo no estoy deacuerdo con los descansos pero bueno

  // Guardamos las horas en formato "HH:mm" (ej: "09:00" o "17:30"). yes because. Despues veremos como nos matamos con react-native para hacer el calendario. Y si ya lo sabes deja tu comentario en linkdIn
  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @ManyToOne(
    () => Prestador,
    (prestador) => prestador.horarios,
    { onDelete: 'CASCADE' }, // Si se borra el prestador, se borra su horario. Facil, sino una locura
  )
  prestador: Prestador;
}
