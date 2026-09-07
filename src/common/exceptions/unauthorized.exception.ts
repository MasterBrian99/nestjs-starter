import { BaseException } from './base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes.js';

export class UnauthorizedException extends BaseException {
  constructor(message?: string) {
    super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED, {
      errorCode: ErrorCodes.UnauthorizedError,
    });
  }
}
