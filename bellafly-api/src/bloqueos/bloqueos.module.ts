import { Module } from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { BloqueosController } from './bloqueos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bloqueo } from './entities/bloqueo.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bloqueo]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BloqueosController],
  providers: [BloqueosService],
})
export class BloqueosModule {}
