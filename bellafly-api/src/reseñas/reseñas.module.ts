import { Module } from '@nestjs/common';
import { ReseñasService } from './reseñas.service';
import { ReseñasController } from './reseñas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reseña } from './entities/reseña.entity';
import { PassportModule } from '@nestjs/passport';
import { Reserva } from 'src/reservas/entities/reserva.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Reseña, Reserva, Cliente, Prestador]),
  ],
  controllers: [ReseñasController],
  providers: [ReseñasService],
})
export class ReseñasModule {}
