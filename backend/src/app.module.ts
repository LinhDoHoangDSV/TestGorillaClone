import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    DatabaseModule,
    LoggerModule,
    ResponseModule,
    QuestionsModule,
    AnswersModule,
    TestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
