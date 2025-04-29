import { Test, TestingModule } from '@nestjs/testing';
import { InitialCodesService } from './initial-codes.service';

describe('InitialCodesService', () => {
  let service: InitialCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialCodesService],
    }).compile();

    service = module.get<InitialCodesService>(InitialCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
