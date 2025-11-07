import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common'; // <-- Asegúrate de que 'Body' esté importado
import { AuthGuard } from '@nestjs/passport';
import { PrestadoresService } from './prestadores.service';
import { CreatePrestadorDto } from './dto/create-prestadore.dto';
import { LoginPrestadorDto } from './dto/login-prestador.dto';
import { Prestador } from './entities/prestadore.entity';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Controller('prestadores')
export class PrestadoresController {
  constructor(private readonly prestadoresService: PrestadoresService) {}

  @Post() // <-- Esta es la ruta POST /prestadores. Solo lo coloco una vez, si no sabes q es una ruta vete a ver un video de FastCode o  Midudev o yo q se
  create(@Body() createPrestadorDto: CreatePrestadorDto) {
    return this.prestadoresService.create(createPrestadorDto);
  }
  @Post('login')
  login(@Body() loginPrestadorDto: LoginPrestadorDto) {
    return this.prestadoresService.login(loginPrestadorDto);
  }

  @Get('perfil') // GET /prestadores/perfil. igual te dejo esta por aqui
  @UseGuards(AuthGuard())
  getPerfil(@Req() req) {
    const prestador: Prestador = req.user;

    return {
      message: `Hola, ${prestador.nombre}`,
      id: prestador.id,
      email: prestador.email,
    };
  }

  @Patch('mi-perfil')
  @UseGuards(AuthGuard())
  updatePerfil(@Body() updatePerfilDto: UpdatePerfilDto, @Req() req) {
    const prestador: Prestador = req.user;
    return this.prestadoresService.updatePerfil(prestador.id, updatePerfilDto);
  }
}
