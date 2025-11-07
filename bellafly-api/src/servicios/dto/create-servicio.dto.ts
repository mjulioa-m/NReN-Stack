import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
} from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  precio: number;

  @IsInt()
  @IsPositive()
  @Min(1) // Al menos 1 minuto. Lo que tu duras en otras cosas
  duracion: number; // Duración en minutos
}
