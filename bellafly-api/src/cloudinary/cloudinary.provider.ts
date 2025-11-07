import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; // Importa el SDK

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    // --- AQUÍ ESTÁ LA CORRECCIÓN ---

    // 1. Llama a la configuración (esto no devuelve nada)
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    // 2. Devuelve el SDK (el objeto 'cloudinary' importado)
    return cloudinary;
  },
  inject: [ConfigService],
};
