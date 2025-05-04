import { Module } from '@nestjs/common';
import { LoggerModule } from './features/logger/logger.module';
import { ResponseModule } from './features/response/response.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter';
import { ValidationInputPipe } from './common/pipe/validation-input.pipe';
import { QuestionsModule } from './features/questions/questions.module';
import { DatabaseModule } from './config/database/database.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AnswersModule } from './features/answers/answers.module';
import { TestsModule } from './features/tests/tests.module';
import { StatisticsModule } from './features/statistics/statistics.module';
import { UsersModule } from './features/users/users.module';
import { RolesModule } from './features/roles/roles.module';
import { TestAssignmentModule } from './features/test-assignment/test-assignment.module';
import { UserAnswersModule } from './features/user-answers/user-answers.module';
import { MailServiceModule } from './features/mail-service/mail-service.module';
import { AuthModule } from './features/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InitialCodesModule } from './features/initial-codes/initial-codes.module';
import { TestCasesModule } from './features/test-cases/test-cases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    LoggerModule,
    ResponseModule,
    QuestionsModule,
    AnswersModule,
    TestsModule,
    StatisticsModule,
    UsersModule,
    RolesModule,
    TestAssignmentModule,
    UserAnswersModule,
    MailServiceModule,
    AuthModule,
    InitialCodesModule,
    TestCasesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationInputPipe,
    },
  ],
})
export class AppModule {}
