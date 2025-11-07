import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Horario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
