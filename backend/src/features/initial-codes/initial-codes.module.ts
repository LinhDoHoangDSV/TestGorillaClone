import { Module } from '@nestjs/common';
import { InitialCodesService } from './initial-codes.service';
import { InitialCodesController } from './initial-codes.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [InitialCodesController],
  providers: [InitialCodesService],
  imports: [LoggerModule, ResponseModule],
})
export class InitialCodesModule {}
