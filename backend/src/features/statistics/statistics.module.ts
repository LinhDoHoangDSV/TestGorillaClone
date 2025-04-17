import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [LoggerModule, ResponseModule],
})
export class StatisticsModule {}
