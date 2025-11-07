import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBloqueoDto {
  @IsDateString() // Valida que sea un string de fecha (ej: "2025-11-20T10:00:00Z")
  @IsNotEmpty()
  fechaInicio: Date;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: Date;

  @IsString()
  @IsOptional() // El motivo es opcional
  motivo?: string;
}
