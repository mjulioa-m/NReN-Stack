import { Module } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { PortafolioController } from './portafolio.controller';

@Module({
  controllers: [PortafolioController],
  providers: [PortafolioService],
})
export class PortafolioModule {}
