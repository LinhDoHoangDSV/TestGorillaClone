import { Module } from '@nestjs/common';
import { TestAssignmentService } from './test-assignment.service';
import { TestAssignmentController } from './test-assignment.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';
import { TestsModule } from '../tests/tests.module';
import { MailServiceModule } from '../mail-service/mail-service.module';

@Module({
  controllers: [TestAssignmentController],
  providers: [TestAssignmentService],
  imports: [LoggerModule, ResponseModule, TestsModule, MailServiceModule],
  exports: [TestAssignmentService],
})
export class TestAssignmentModule {}
