import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { JwtClienteGuard } from 'src/clientes/auth/jwt-cliente.guard';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { AuthGuard } from '@nestjs/passport';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { JwtGeneralGuard } from 'src/auth/jwt-general.guard';
import { JwtPayload } from 'src/auth/jwt-general.strategy';
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @UseGuards(JwtClienteGuard)
  create(@Body() createReservaDto: CreateReservaDto, @Req() req) {
    const cliente: Cliente = req.user;
    return this.reservasService.create(createReservaDto, cliente);
  }
  @Get('mis-reservas')
  @UseGuards(JwtClienteGuard)
  findMisReservas(@Req() req) {
    const cliente: Cliente = req.user;
    return this.reservasService.findMisReservas(cliente);
  }
  @Get('mis-citas')
  @UseGuards(AuthGuard())
  findMisCitas(@Req() req) {
    const prestador: Prestador = req.user;
    return this.reservasService.findMisCitas(prestador);
  }

  @Patch(':id/confirmar')
  @UseGuards(AuthGuard())
  confirmarReserva(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const prestador: Prestador = req.user;
    return this.reservasService.confirmarReserva(id, prestador);
  }

  @Patch(':id/cancelar')
  @UseGuards(JwtGeneralGuard)
  cancelarReserva(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const userPayload: JwtPayload = req.user;
    return this.reservasService.cancelarReserva(id, userPayload);
  }

  @Patch(':id/completar')
  @UseGuards(AuthGuard())
  completarReserva(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const prestador: Prestador = req.user;
    return this.reservasService.completarReserva(id, prestador);
  }
}
