import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { AuthGuard } from '@nestjs/passport';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
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
  @Patch(':id') //Usamos Patch y no PUT porque es un cambio parcial, hay que leer crack
  @UseGuards(AuthGuard())
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServicioDto: UpdateServicioDto,
    @Req() req,
  ) {
    const prestador: Prestador = req.user;

    return this.serviciosService.update(id, updateServicioDto, prestador);
  }

  //No soy fan de poner endpoints de DELETE para que no me hechen las culpas de que algo se borró, pero al final sera tu problema y no mio xd
  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const prestador: Prestador = req.user;

    return this.serviciosService.remove(id, prestador);
  }
  @Post(':id/fotos')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  addFoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const prestador: Prestador = req.user;
    return this.serviciosService.addFoto(id, prestador, file);
  }
  @Get(':id/fotos')
  findFotos(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviciosService.findFotosByServicio(id);
  }
  //este endpoint no lo he probado en postman porque tengo que llamar otro antes para buscar el servicio y la foto, asi que pruebenlo ustedes y me dicen si funciona, sino ya lo testeare cuando lo necesite en el front xd
  @Delete(':idServicio/fotos/:idFoto')
  @UseGuards(AuthGuard())
  removeFoto(
    @Param('idServicio', ParseUUIDPipe) idServicio: string,
    @Param('idFoto', ParseUUIDPipe) idFoto: string,
    @Req() req,
  ) {
    const prestador: Prestador = req.user;
    return this.serviciosService.removeFoto(idServicio, idFoto, prestador);
  }
}
