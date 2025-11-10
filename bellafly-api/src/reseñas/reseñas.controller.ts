import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReseñasService } from './reseñas.service';
import { CreateReseñaDto } from './dto/create-reseña.dto';
import { JwtClienteGuard } from 'src/clientes/auth/jwt-cliente.guard'; // <-- 2. Importar Guardia
import { Cliente } from 'src/clientes/entities/cliente.entity'; // <-- 3. Importar Entidad

@Controller('resenas')
export class ReseñasController {
  constructor(private readonly reseñasService: ReseñasService) {}

  @Post()
  @UseGuards(JwtClienteGuard) // <-- 4. ¡Protegido! Solo un CLIENTE puede
  create(@Body() createReseñaDto: CreateReseñaDto, @Req() req) {
    const cliente: Cliente = req.user;
    return this.reseñasService.create(createReseñaDto, cliente);
  }
}
