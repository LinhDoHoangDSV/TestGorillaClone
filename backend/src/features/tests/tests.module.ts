import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
  imports: [LoggerModule, ResponseModule, StatisticsModule],
  exports: [TestsService],
})
export class TestsModule {}
