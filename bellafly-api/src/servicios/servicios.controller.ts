import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseUUIDPipe, // <-- 1. Importar
} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { AuthGuard } from '@nestjs/passport'; // <-- 2. Importar
import { Prestador } from 'src/prestadores/entities/prestadore.entity'; // <-- 3. Importar

@Controller('servicios') // La ruta base es /servicios
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  // 4. Modificar el método 'create'
  @Post() // Ruta: POST /servicios
  @UseGuards(AuthGuard()) // <-- 5. ¡PROTEGER LA RUTA!
  create(
    @Body() createServicioDto: CreateServicioDto,
    @Req() req, // <-- 6. Obtener la petición completa
  ) {
    // 7. Sacar el usuario (Prestador) que el AuthGuard adjuntó
    const prestador: Prestador = req.user;

    // 8. Llamar al servicio con el DTO y el Prestador
    return this.serviciosService.create(createServicioDto, prestador);
  }
  @Get() // Ruta: GET /servicios
  @UseGuards(AuthGuard()) // <-- 2. ¡Protégelo!
  findAll(@Req() req) {
    // 3. Obtén el prestador del token
    const prestador: Prestador = req.user;

    // 4. Llama al servicio con el prestador
    return this.serviciosService.findAll(prestador);
  }
  // MODIFICA ESTE MÉTODO
  @Get(':id') // Ruta: GET /servicios/un-uuid-aqui
  @UseGuards(AuthGuard()) // <-- 2. ¡Protégelo!
  findOne(
    @Param('id', ParseUUIDPipe) id: string, // <-- 3. Captura el 'id' de la URL
    @Req() req,
  ) {
    // 4. Obtén el prestador del token
    const prestador: Prestador = req.user;

    // 5. Llama al servicio con ambos IDs
    return this.serviciosService.findOne(id, prestador);
  }
  // ... (Aquí están las otras rutas findAll, findOne, etc.)
}
