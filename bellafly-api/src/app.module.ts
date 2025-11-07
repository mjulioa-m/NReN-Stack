import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Faltaba esto
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Faltaba esto
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrestadoresModule } from './prestadores/prestadores.module';
import { ServiciosModule } from './servicios/servicios.module';

@Module({
  imports: [
    // 1. Cargar el .env PRIMERO y hacerlo GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Crear la conexión principal a la BD (el DataSource)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Usa el config module
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ¡Solo para desarrollo!
      }),
    }),

    // 3. Ahora sí, cargar tu módulo (que depende de la BD)
    PrestadoresModule,

    ServiciosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
