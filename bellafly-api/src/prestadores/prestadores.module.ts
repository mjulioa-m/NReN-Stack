import { Module } from '@nestjs/common';
import { PrestadoresService } from './prestadores.service';
import { PrestadoresController } from './prestadores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestador } from './entities/prestadore.entity';
import { JwtModule } from '@nestjs/jwt'; // <-- 1. Importar
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- 2. Importar Config
import { PassportModule } from '@nestjs/passport'; // <-- 1. Importar Passport
import { JwtStrategy } from './auth/jwt.strategy'; // <-- 2. Importar nuestra Estrategia
@Module({
  imports: [
    TypeOrmModule.forFeature([Prestador]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 3. Registrar el JwtModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Para poder leer el .env
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lee el secreto del .env
        signOptions: { expiresIn: '1d' }, // El token durará 1 día
      }),
    }),
  ],
  controllers: [PrestadoresController],
  providers: [PrestadoresService, JwtStrategy],
})
export class PrestadoresModule {}
