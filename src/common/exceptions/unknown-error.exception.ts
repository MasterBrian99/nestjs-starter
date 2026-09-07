import { BaseException } from './base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes.js';

export class UnknownErrorException extends BaseException {
  constructor() {
    super('Unknown error occured', HttpStatus.INTERNAL_SERVER_ERROR, {
      errorCode: ErrorCodes.UnknownError,
    });
  }
}
