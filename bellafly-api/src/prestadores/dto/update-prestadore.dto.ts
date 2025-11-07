import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestadorDto } from './create-prestadore.dto';

export class UpdatePrestadoreDto extends PartialType(CreatePrestadorDto) {}
