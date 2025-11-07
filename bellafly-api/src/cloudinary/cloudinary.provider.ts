import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; // <-- 1. Importa el SDK de Cloudinary

// 2. Este es el "Token" que usaremos para inyectarlo en otros servicios
export const CLOUDINARY = 'Cloudinary';

// 3. Este es el "Provider" personalizado
export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY, // El nombre/token del provider
  useFactory: (configService: ConfigService) => {
    // 4. Esta es la "fábrica" que se ejecuta al inicio
    //    Lee las claves del .env y configura el SDK
    return cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService], // 5. Le decimos a NestJS que inyecte el ConfigService
};
