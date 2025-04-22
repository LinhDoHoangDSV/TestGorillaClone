import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const sid = request.cookies?.sid;

    if (!sid) {
      throw new UnauthorizedException('You need to log in to continue');
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
      if (!secret) {
        throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined');
      }

      const payload = await new Promise((resolve, reject) => {
        jwt.verify(sid, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Error while authenticating');
    }

    return true;
  }
}
