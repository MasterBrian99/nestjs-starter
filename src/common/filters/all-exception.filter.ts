import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
  ContextType,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';
import { ErrorCodes } from '../errors/error-codes.js';
import jsonwebtoken from 'jsonwebtoken';

const { JsonWebTokenError: JsonWebTokenErrorClass, TokenExpiredError: TokenExpiredErrorClass } =
  jsonwebtoken;
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';
import { AuthenticationError } from '@nestjs/apollo';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    this.logger.error(exception);

    if (gqlHost.getType<ContextType | 'graphql'>() === 'graphql') {
      if (exception instanceof TokenExpiredErrorClass) {
        return new AuthenticationError('Unauthorized');
      }
      if (exception instanceof JsonWebTokenErrorClass) {
        return new AuthenticationError('Invalid token');
      }

      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ServiceUnavailableException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof TokenExpiredErrorClass) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        error: UnauthorizedException.name,
      });
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.name,
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unknown error occured',
      error: 'UnknownError',
      errorCode: ErrorCodes.UnknownError,
    });
  }
}
