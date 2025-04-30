import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, LoggerModule, ResponseModule, StatisticsModule],
})
export class AuthModule {}
