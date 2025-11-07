import {
  IsBoolean,
  IsInt,
  IsMilitaryTime,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateHorarioDto {
  @IsInt()
  @Min(0) // Domingo
  @Max(6) // Sábado
  diaDeSemana: number;

  @IsMilitaryTime() // Valida formato "HH:mm"
  horaInicio: string;

  @IsMilitaryTime()
  horaFin: string;

  @IsBoolean()
  @IsOptional() // Si no lo mandan, usamos el default de la entidad, sino explota esta vaina
  estaActivo?: boolean;
}
