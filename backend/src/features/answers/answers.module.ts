import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [LoggerModule, ResponseModule, QuestionsModule],
  exports: [AnswersService],
})
export class AnswersModule {}
