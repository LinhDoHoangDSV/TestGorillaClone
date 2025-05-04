import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger/swagger.config';
import * as cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: [
      configService.get<string>('FE_URL'),
      configService.get<string>('FE_LOCAL_URL'),
    ],
    credentials: true,
  });

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory(), {
    useGlobalPrefix: true,
  });

  await app.listen(configService.get<number>('BE_PORT') ?? 3010);
}
bootstrap();
