import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from 'src/common/guard/google_auth.guard';
import { UsersService } from '../users/users.service';
import { RequestWithUserDto, TokenPayload } from 'src/common/constant';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Response } from '../response/response';
import { LoggerService } from '../logger/logger.service';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import { RefreshTokenGuard } from 'src/common/guard/refresh_auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly response: Response,
    private readonly logger: LoggerService,
  ) {}

  @UseGuards(GoogleAuthGuard)
  @Post('log-in')
  async loginWithGoogle(@Req() request: RequestWithUserDto, @Res() response) {
    try {
      const { user } = request;

      const existingUser = await this.userService.findOne(user.userId);

      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      const payload: TokenPayload = {
        role: existingUser?.role_id === 3 ? 'ADMIN' : 'HR',
        userId: existingUser?.id,
      };

      const accessToken = jwt.sign(
        payload,
        this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        {
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      );

      const maxAgeAccessToken =
        +this.configService
          .get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
          .slice(0, -1) *
        1000 *
        60;

      const refreshToken = jwt.sign(
        payload,
        this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        {
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      );

      const maxAgeRefreshToken =
        +this.configService
          .get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
          .slice(0, -1) *
        1000 *
        60 *
        60 *
        24;

      await this.userService.setCurrentRefreshToken(
        refreshToken,
        existingUser.id,
      );

      request.res.cookie('sid', accessToken, {
        maxAge: maxAgeAccessToken,
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        path: '/',
      });

      request.res.cookie('refresh_token', refreshToken, {
        maxAge: maxAgeRefreshToken,
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        path: '/',
      });

      this.logger.debug('Login successfully');
      this.response.initResponse(true, 'Login successfully', null);

      return response.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Login failed', error?.stack);

      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return response.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(false, 'System error while loging in', null);
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(this.response);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getUserInformation(@Res() res, @Req() request: RequestWithUserDto) {
    try {
      const { user } = request;
      const existingUser = await this.userService.findOne(user?.userId);

      const { refresh_token, ...userData } = existingUser;

      this.logger.debug('Get user information successfully');
      this.response.initResponse(
        true,
        "Get user\'s information successfully",
        userData,
      );

      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error("Fail to get user's information", error?.stack);

      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(false, 'System error while loging in', null);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(@Req() request: RequestWithUserDto, @Res() res) {
    const { user } = request;
    try {
      const existingUser = await this.userService.findOne(user.userId);

      if (!existingUser) {
        throw new BadRequestException('User not found');
      }

      const payload: TokenPayload = {
        role: existingUser?.role_id === 3 ? 'ADMIN' : 'HR',
        userId: existingUser?.id,
      };

      const accessToken = jwt.sign(
        payload,
        this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        {
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      );

      const maxAgeAccessToken =
        +this.configService
          .get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
          .slice(0, -1) *
        1000 *
        60;

      request.res.cookie('sid', accessToken, {
        maxAge: maxAgeAccessToken,
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        path: '/',
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: `Generating token successfully`,
        data: null,
      });
    } catch (error) {
      this.logger.error('Error while generating token', error?.stack);

      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(419).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while generating token',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @Post('log-out')
  async logout(@Res() res, @Req() request: RequestWithUserDto) {
    try {
      request.res.clearCookie('sid');
      request.res.clearCookie('refresh_token');

      this.logger.debug('Logout successfully');
      this.response.initResponse(true, 'Logout successfully', null);

      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Logout failed', error?.stack);

      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while loging out',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
