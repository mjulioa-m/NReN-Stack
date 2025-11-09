import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { PassportModule } from '@nestjs/passport';

import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Bloqueo } from 'src/bloqueos/entities/bloqueo.entity';
import { Prestador } from 'src/prestadores/entities/prestadore.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { JwtGeneralStrategy } from 'src/auth/jwt-general.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      Reserva,
      Servicio,
      Horario,
      Bloqueo,
      Prestador,
      Cliente,
    ]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService, JwtGeneralStrategy],
})
export class ReservasModule {}
