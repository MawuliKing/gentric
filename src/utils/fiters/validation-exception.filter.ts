import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    let firstErrorMessage = 'An error occurred';

    if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
      firstErrorMessage = exceptionResponse.message[0];
    } else if (exceptionResponse.message) {
      firstErrorMessage = exceptionResponse.message;
    }

    response.status(status).json({
      statusCode: status,
      error: 'Bad Request',
      message: firstErrorMessage,
    });
  }
}
