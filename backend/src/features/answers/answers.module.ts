import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [LoggerModule, ResponseModule],
})
export class AnswersModule {}
