import { Test, TestingModule } from '@nestjs/testing';
import { PrestadoresService } from './prestadores.service';

describe('PrestadoresService', () => {
  let service: PrestadoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestadoresService],
    }).compile();

    service = module.get<PrestadoresService>(PrestadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
