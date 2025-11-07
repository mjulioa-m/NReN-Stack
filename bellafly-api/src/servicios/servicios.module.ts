import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { PassportModule } from '@nestjs/passport';
import { FotoServicio } from './entities/foto-servicio.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio, FotoServicio]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CloudinaryModule,
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
})
export class ServiciosModule {}
