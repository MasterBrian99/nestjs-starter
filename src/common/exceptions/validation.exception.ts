import { BaseException } from './base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes.js';

export class ValidationException extends BaseException {
  constructor(errors: unknown) {
    super('Validation Failed', HttpStatus.BAD_REQUEST, {
      errorCode: ErrorCodes.ValidationError,
      errors,
    });
  }
}
