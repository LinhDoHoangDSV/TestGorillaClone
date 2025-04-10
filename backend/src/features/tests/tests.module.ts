import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
  imports: [LoggerModule, ResponseModule],
})
export class TestsModule {}
