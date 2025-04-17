import { Module } from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersController } from './user-answers.controller';
import { QuestionsModule } from '../questions/questions.module';
import { TestAssignmentModule } from '../test-assignment/test-assignment.module';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [UserAnswersController],
  providers: [UserAnswersService],
  imports: [
    QuestionsModule,
    TestAssignmentModule,
    LoggerModule,
    ResponseModule,
  ],
  exports: [UserAnswersService],
})
export class UserAnswersModule {}
