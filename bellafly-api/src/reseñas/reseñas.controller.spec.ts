import { Test, TestingModule } from '@nestjs/testing';
import { ReseñasController } from './reseñas.controller';
import { ReseñasService } from './reseñas.service';

describe('ReseñasController', () => {
  let controller: ReseñasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReseñasController],
      providers: [ReseñasService],
    }).compile();

    controller = module.get<ReseñasController>(ReseñasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
