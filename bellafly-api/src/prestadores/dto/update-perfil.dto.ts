import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  @MaxLength(500) // Límite para la biografía
  biografia?: string;

  @IsString()
  @IsOptional()
  nombreProfesional?: string;

  @IsString()
  @IsOptional()
  especialidad?: string;

  @IsUrl() // Debe ser una URL válida
  @IsOptional()
  urlFotoPerfil?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsBoolean()
  @IsOptional()
  aceptaDomicilio?: boolean;

  @IsString() // Podríamos usar IsPhoneNumber, pero IsString es más flexible
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsUrl()
  @IsOptional()
  sitioWeb?: string;
}
