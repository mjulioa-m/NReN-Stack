import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { CreateBloqueoDto } from './dto/create-bloqueo.dto';
import { AuthGuard } from '@nestjs/passport';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';

@Controller('bloqueos')
@UseGuards(AuthGuard())
export class BloqueosController {
  constructor(private readonly bloqueosService: BloqueosService) {}

  @Post()
  create(@Body() createBloqueoDto: CreateBloqueoDto, @Req() req) {
    const prestador: Prestador = req.user;
    return this.bloqueosService.create(createBloqueoDto, prestador);
  }

  @Get()
  findAll(@Req() req) {
    const prestador: Prestador = req.user;
    return this.bloqueosService.findAll(prestador);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const prestador: Prestador = req.user;
    return this.bloqueosService.remove(id, prestador);
  }
}
