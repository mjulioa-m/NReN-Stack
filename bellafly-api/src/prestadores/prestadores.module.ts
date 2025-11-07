import { Module } from '@nestjs/common';
import { PrestadoresService } from './prestadores.service';
import { PrestadoresController } from './prestadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestador } from './entities/prestadore.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Prestador]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // El token durará 1 día o lo que se te de la gana pa
      }),
    }),
  ],
  controllers: [PrestadoresController],
  providers: [PrestadoresService, JwtStrategy],
})
export class PrestadoresModule {}
