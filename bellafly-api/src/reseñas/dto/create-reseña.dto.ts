import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReseñaDto {
  @IsUUID()
  @IsNotEmpty()
  reservaId: string; // El ID de la reserva que se está calificando

  @IsInt()
  @Min(1) // Calificación mínima de 1 estrella
  @Max(5) // Calificación máxima de 5 estrellas
  @IsNotEmpty()
  calificacion: number; // Las estrellas (obligatorio)

  @IsString()
  @IsOptional() // El texto (opcional)
  comentario?: string;
}
