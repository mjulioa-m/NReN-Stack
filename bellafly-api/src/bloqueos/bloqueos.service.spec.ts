import { Test, TestingModule } from '@nestjs/testing';
import { BloqueosService } from './bloqueos.service';

describe('BloqueosService', () => {
  let service: BloqueosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloqueosService],
    }).compile();

    service = module.get<BloqueosService>(BloqueosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
