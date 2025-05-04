import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/features/users/users.service';
import { config } from 'dotenv';

config();

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const refreshToken = request.cookies?.refresh_token;

    if (!refreshToken) {
      response.clearCookie('sid');
      response.clearCookie('refresh_token');
      throw new HttpException('No refresh token provided', 419);
    }

    try {
      const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');

      const payload = await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });

      const user = await this.usersService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload['userId'],
      );

      if (!user) {
        response.clearCookie('sid');
        response.clearCookie('refresh_token');
        throw new HttpException('No refresh token provided', 419);
      }

      console.log('Refresh Token Payload:', payload);
      request['user'] = {
        userId: user.id,
        role: user.role_id === 3 ? 'ADMIN' : 'HR',
      };
    } catch (error) {
      response.clearCookie('sid');
      response.clearCookie('refresh_token');
      throw new HttpException('Error while generating token', 419);
    }

    return true;
  }
}
