import { IsOptional, IsString, IsPhoneNumber, IsUrl } from 'class-validator';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsUrl()
  @IsOptional()
  urlFotoPerfil?: string;

  // No permitimos cambiar el email o la contraseña en esta ruta. porque si no se vuelve un peo bien grande
}
