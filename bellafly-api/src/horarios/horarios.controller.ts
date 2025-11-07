import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { AuthGuard } from '@nestjs/passport';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';

@Controller('horarios')
@UseGuards(AuthGuard())
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  // 3. Ruta para ESTABLECER/REEMPLAZAR el horario. Para que llamar un endpoint que borre y despues este que guarde el nuevo horario? Eres estupido? X2
  @Put() //Usamos PUT para editar. Si ves que aqui si usamos put y no patch? Ya leiste el por qué? o sigues jugando LOL?
  definirHorario(@Body() horariosDto: CreateHorarioDto[], @Req() req) {
    const prestador: Prestador = req.user;
    return this.horariosService.definirHorario(horariosDto, prestador);
  }

  // 4. Ruta para OBTENER el horario guardado.Para que sepan que tienen que laburar x2
  @Get()
  findAll(@Req() req) {
    const prestador: Prestador = req.user;
    return this.horariosService.findAll(prestador);
  }
}
