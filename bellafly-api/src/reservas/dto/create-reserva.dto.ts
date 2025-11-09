import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservaDto {
  @IsUUID()
  @IsNotEmpty()
  servicioId: string; // El ID del servicio que quiere reservar

  @IsDateString() // ej: "2025-11-20T10:00:00Z" (¡siempre en UTC!)
  @IsNotEmpty()
  fechaInicio: Date; // La hora de inicio de la cita
}
