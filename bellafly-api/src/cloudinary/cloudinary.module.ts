import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider'; // <-- 1. Importa el provider

@Module({
  imports: [ConfigModule], // Sigue importando ConfigModule para que el provider lo use
  providers: [CloudinaryProvider], // <-- 2. Añade el provider a la lista
  exports: [CloudinaryProvider], // <-- 3. EXPORTA el provider
})
export class CloudinaryModule {}
