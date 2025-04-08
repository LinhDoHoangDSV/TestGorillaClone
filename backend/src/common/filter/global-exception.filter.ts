import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Catch()
export class GlobalExceptionFilter extends ExceptionsHandler {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errors = exception.getResponse
      ? exception.getResponse()
      : exception.message;

    const message = errors.message ? errors.message : 'System error!';

    const newErrors = errors.errors ? errors.errors : errors.error;

    response.status(status).json({
      success: false,
      message,
      errors:
        typeof newErrors === 'string'
          ? [
              {
                property: newErrors,
                constraints: newErrors,
              },
            ]
          : newErrors,
    });
  }
}
