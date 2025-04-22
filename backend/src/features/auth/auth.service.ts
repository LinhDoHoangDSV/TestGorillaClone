import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import axios from 'axios';
import { GoogleUserInfo, userInfoUrl } from 'src/common/constant';

@Injectable()
export class AuthService {
  async getCookieWithJwtAccessToken(userId: number) {
    //   const payload: TokenPayload = {
    //     userId,
    //     userType: user.userType,
    //   };
    //   const token = this.jwtService.sign(payload, {
    //     secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    //     expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME} days`,
    //   });
    //   const maxAgeDay = +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    //   return { token, maxAge: maxAgeDay * 24 * 60 * 60 * 1000 };
    // }
  }

  async verifyGoogleToken(accessToken: string) {
    try {
      console.log('token', accessToken);

      const response = await axios.get<GoogleUserInfo>(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { given_name, family_name, email } = response.data;
      return { given_name, family_name, email };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Authentication failed');
    }
  }
}
