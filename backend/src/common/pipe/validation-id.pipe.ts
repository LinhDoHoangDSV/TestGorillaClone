import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationIDPipe implements PipeTransform {
  transform(value: any) {
    if (!+value) {
      throw new BadRequestException('ID must be a number');
    }

    return value;
  }
}
