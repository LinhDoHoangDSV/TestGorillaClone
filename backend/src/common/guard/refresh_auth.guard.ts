import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
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
      throw new UnauthorizedException('No refresh token provided');
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
        throw new UnauthorizedException('Invalid refresh token');
      }

      console.log('Refresh Token Payload:', payload);
      request['user'] = {
        userId: user.id,
        role: user.role_id === 3 ? 'ADMIN' : 'HR',
      };
    } catch (error) {
      response.clearCookie('sid');
      response.clearCookie('refresh_token');
      throw new UnauthorizedException(
        'Error while authenticating refresh token',
      );
    }

    return true;
  }
}
