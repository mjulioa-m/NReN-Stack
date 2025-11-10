import { Test, TestingModule } from '@nestjs/testing';
import { ReseñasService } from './reseñas.service';

describe('ReseñasService', () => {
  let service: ReseñasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReseñasService],
    }).compile();

    service = module.get<ReseñasService>(ReseñasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
