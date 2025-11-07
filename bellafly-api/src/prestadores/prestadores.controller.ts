import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common'; // <-- Asegúrate de que 'Body' esté importado
import { AuthGuard } from '@nestjs/passport';
import { PrestadoresService } from './prestadores.service';
import { CreatePrestadorDto } from './dto/create-prestadore.dto';
import { LoginPrestadorDto } from './dto/login-prestador.dto';
import { Prestador } from './entities/prestadore.entity';
// ... (los otros import de 'Get', 'Patch', etc. pueden quedarse)

@Controller('prestadores')
export class PrestadoresController {
  constructor(private readonly prestadoresService: PrestadoresService) {}

  @Post() // <-- Esta es la ruta POST /prestadores
  create(@Body() createPrestadorDto: CreatePrestadorDto) {
    // 1. NestJS valida automáticamente el 'body' contra el DTO
    // 2. Si es válido, llama a nuestro servicio
    return this.prestadoresService.create(createPrestadorDto);
  }
  // 2. AÑADIR ESTE NUEVO MÉTODO
  @Post('login') // Ruta: POST /prestadores/login (LOGIN)
  login(@Body() loginPrestadorDto: LoginPrestadorDto) {
    return this.prestadoresService.login(loginPrestadorDto);
  }

  @Get('perfil') // GET /prestadores/perfil
  @UseGuards(AuthGuard()) // <-- ¡AQUÍ ESTÁ EL GUARDIA DE SEGURIDAD!
  getPerfil(@Req() req) {
    // Gracias a la JwtStrategy, 'req.user' contiene
    // toda la info del prestador que hicimos en el 'validate'
    const prestador: Prestador = req.user;

    // Solo como ejemplo, devolvemos un saludo
    // (Asegúrate de que 'nombre' exista en tu entidad)
    return {
      message: `Hola, ${prestador.nombre}`,
      id: prestador.id,
      email: prestador.email,
    };
  }

  // ... (aquí están las otras rutas 'findAll', 'findOne', etc.)
}
