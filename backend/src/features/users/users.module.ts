import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [LoggerModule, ResponseModule],
  exports: [UsersService],
})
export class UsersModule {}
