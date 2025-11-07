import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Faltaba esto
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Faltaba esto
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrestadoresModule } from './prestadores/prestadores.module';
import { ServiciosModule } from './servicios/servicios.module';
import { HorariosModule } from './horarios/horarios.module';
import { BloqueosModule } from './bloqueos/bloqueos.module';
import { PortafolioModule } from './portafolio/portafolio.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // 1. Cargar el .env PRIMERO y hacerlo GLOBAL. Sino como hacemos funcionar al JWT? Por cierto crea tu el .env, algo tinenes q hacer
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Crear la conexión principal a la BD (el DataSource). Esto tambien te toca a ti, claramente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ¡Solo para desarrollo!. Si la dejas en producción vas a llorar. Si quieres saber por qué preguntale a chatgpt, cule pava explicarte pero en resumen puede borrar informacion
      }),
    }),

    PrestadoresModule,

    ServiciosModule,

    HorariosModule,

    BloqueosModule,

    PortafolioModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
