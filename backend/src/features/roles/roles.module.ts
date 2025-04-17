import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { LoggerModule } from '../logger/logger.module';
import { ResponseModule } from '../response/response.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [LoggerModule, ResponseModule],
})
export class RolesModule {}
