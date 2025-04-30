import { Module } from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { TestCasesController } from './test-cases.controller';
import { ResponseModule } from '../response/response.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [TestCasesController],
  providers: [TestCasesService],
  imports: [ResponseModule, LoggerModule],
})
export class TestCasesModule {}
