import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { AuthGuard } from '@nestjs/passport'; // <-- 2. Importar
import { Prestador } from 'src/prestadores/entities/prestadore.entity'; // <-- 3. Importar

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @UseGuards(AuthGuard()) //Siempre protege las Rutas para q el Ruso no se te meta
  create(@Body() createServicioDto: CreateServicioDto, @Req() req) {
    const prestador: Prestador = req.user;

    return this.serviciosService.create(createServicioDto, prestador);
  }
  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req) {
    const prestador: Prestador = req.user;

    return this.serviciosService.findAll(prestador);
  }
  @Get(':id') // Ruta: GET /servicios/un-uuid-aqui. TE dejo otra ruta con parametros para que no te me pierdas bebé
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const prestador: Prestador = req.user;

    return this.serviciosService.findOne(id, prestador);
  }
}
