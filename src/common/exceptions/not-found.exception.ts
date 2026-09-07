import { BaseException } from './base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes.js';

export class NotFoundException extends BaseException {
  constructor(resource: string | number) {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, {
      errorCode: ErrorCodes.NotFoundError,
    });
  }
}
