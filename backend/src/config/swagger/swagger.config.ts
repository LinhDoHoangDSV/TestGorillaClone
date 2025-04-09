import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TestGorilla')
  .setDescription('TestGorilla API description')
  .setVersion('1.0')
  .build();
