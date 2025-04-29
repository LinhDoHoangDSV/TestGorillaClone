import { Test, TestingModule } from '@nestjs/testing';
import { InitialCodesController } from './initial-codes.controller';
import { InitialCodesService } from './initial-codes.service';

describe('InitialCodesController', () => {
  let controller: InitialCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitialCodesController],
      providers: [InitialCodesService],
    }).compile();

    controller = module.get<InitialCodesController>(InitialCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
