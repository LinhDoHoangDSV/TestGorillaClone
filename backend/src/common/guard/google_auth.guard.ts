import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from 'src/features/auth/auth.service';
import { UsersService } from 'src/features/users/users.service';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';
import { LoggerService } from 'src/features/logger/logger.service';
import { StatisticsService } from 'src/features/statistics/statistics.service';
import { CreateStatisticDto } from 'src/features/statistics/dto/create-statistic.dto';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly userService: UsersService,
    private readonly dataSource: DataSource,
    private readonly statisticsService: StatisticsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gid = request?.headers?.gid;

    if (!gid || typeof gid !== 'string') {
      this.logger.warn('Missing or invalid Google token');
      throw new UnauthorizedException('Token Google is invalid');
    }

    try {
      const tokenInfo = await this.authService.verifyGoogleToken(gid);

      if (!tokenInfo?.email) {
        this.logger.warn('Google token does not contain email');
        throw new BadRequestException('Token Google không chứa email hợp lệ');
      }

      let [user] = await this.userService.findByCriterias({
        email: tokenInfo.email,
      });

      if (!user) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const userData: CreateUserDto = {
            first_name: tokenInfo.given_name || 'Unknown',
            last_name: tokenInfo.family_name || 'Unknown',
            email: tokenInfo.email,
            role_id: 2,
          };
          user = await this.userService.create(userData, queryRunner.manager);

          const statisticsData: CreateStatisticDto = {
            active_assess: 0,
            total_assess_complete: 0,
            total_invitation: 0,
            user_id: user.id,
          };

          await this.statisticsService.create(
            statisticsData,
            queryRunner.manager,
          );
          await queryRunner.commitTransaction();
          this.logger.debug(`Created new user: ${user.email}`);
        } catch (error) {
          await queryRunner.rollbackTransaction();
          this.logger.error(
            `Failed to create user: ${error.message}`,
            error?.stack,
          );
          throw new BadRequestException('Không thể tạo tài khoản người dùng');
        } finally {
          await queryRunner.release();
        }
      }

      request.user = {
        userId: user.id,
        email: user.email,
        role: user.role_id === 3 ? 'ADMIN' : 'HR',
      };

      return true;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Fail to login with Google',
      );
    }
  }
}
