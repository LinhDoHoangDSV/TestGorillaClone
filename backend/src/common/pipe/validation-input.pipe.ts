/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class ValidationInputPipe extends ValidationPipe {
  constructor() {
    super({
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: true,
        value: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => {
          if (error.value === undefined) {
            return {
              property: error.property,
              constraints: `Attribute ${error.property} must exist`,
            };
          } else if (error.value === '') {
            return {
              property: error.property,
              constraints: `Attribute ${error.property} is required`,
            };
          } else if (
            error.constraints &&
            error.constraints['whitelistValidation']
          ) {
            return {
              property: error.property,
              constraints: `Attribute ${error.property} is not allowed`,
            };
          }

          return {
            property: error.property,
            constraints: Object.values(error.constraints).join(', '),
          };
        });
        return new BadRequestException({
          message: 'Invalid input data',
          errors: formattedErrors,
        });
      },
    });
  }
}
