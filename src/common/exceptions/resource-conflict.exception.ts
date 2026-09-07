import { BaseException } from './base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes.js';

export class ResourceConflictException extends BaseException {
  constructor() {
    super('Resource already exists', HttpStatus.CONFLICT, {
      errorCode: ErrorCodes.ResourceConflictError,
    });
  }
}
