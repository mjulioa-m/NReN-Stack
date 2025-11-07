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

  @IsNumber({ maxDecimalPlaces: 2 }) // Acepta decimales (ej: 10.50)
  @IsPositive() // Debe ser un número positivo
  @Min(0.01) // Precio mínimo
  precio: number;

  @IsInt() // Debe ser un número entero
  @IsPositive()
  @Min(1) // Al menos 1 minuto
  duracion: number; // Duración en minutos
}
