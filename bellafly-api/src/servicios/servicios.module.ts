import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { PassportModule } from '@nestjs/passport'; // <-- 1. Importar

@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // <-- 2. Añadir
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}
