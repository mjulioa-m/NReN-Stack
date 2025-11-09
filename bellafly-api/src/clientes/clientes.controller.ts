import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors, // <-- 1. Importar
  UploadedFile,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { JwtClienteGuard } from './auth/jwt-cliente.guard';
import { Cliente } from './entities/cliente.entity';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post('registro')
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Post('login')
  login(@Body() loginClienteDto: LoginClienteDto) {
    return this.clientesService.login(loginClienteDto);
  }

  @Get('mi-perfil')
  @UseGuards(JwtClienteGuard)
  getPerfil(@Req() req) {
    const cliente: Cliente = req.user;
    return this.clientesService.getPerfil(cliente.id);
  }

  @Patch('mi-perfil')
  @UseGuards(JwtClienteGuard)
  updatePerfil(@Req() req, @Body() updateClienteDto: UpdateClienteDto) {
    const cliente: Cliente = req.user;
    return this.clientesService.updatePerfil(cliente.id, updateClienteDto);
  }

  @Delete('mi-perfil')
  @UseGuards(JwtClienteGuard)
  removePerfil(@Req() req) {
    const cliente: Cliente = req.user;
    return this.clientesService.removePerfil(cliente.id);
  }
  @Post('mi-perfil/foto')
  @UseGuards(JwtClienteGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFotoPerfil(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const cliente: Cliente = req.user;
    return this.clientesService.uploadFotoPerfil(cliente.id, file);
  }
  @Delete('mi-perfil/foto')
  @UseGuards(JwtClienteGuard)
  deleteFotoPerfil(@Req() req) {
    const cliente: Cliente = req.user;
    return this.clientesService.deleteFotoPerfil(cliente.id);
  }
}
