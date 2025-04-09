import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [LoggerModule, ResponseModule],
})
export class QuestionsModule {}
