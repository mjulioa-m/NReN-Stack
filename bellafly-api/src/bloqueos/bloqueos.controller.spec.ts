import { Test, TestingModule } from '@nestjs/testing';
import { BloqueosController } from './bloqueos.controller';
import { BloqueosService } from './bloqueos.service';

describe('BloqueosController', () => {
  let controller: BloqueosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloqueosController],
      providers: [BloqueosService],
    }).compile();

    controller = module.get<BloqueosController>(BloqueosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
