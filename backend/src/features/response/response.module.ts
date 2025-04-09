import { Module } from '@nestjs/common';
import { Response } from './response';

@Module({
  providers: [
    {
      provide: Response,
      useValue: new Response(false, '', null),
    },
  ],
  exports: [Response],
})
export class ResponseModule {}
