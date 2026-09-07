import { BaseException } from '../../../common/exceptions/base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../../common/errors/error-codes.js';

export class EmailAlreadyTakenException extends BaseException {
  constructor(email: string) {
    super(`${email} already in use`, HttpStatus.CONFLICT, {
      errorCode: ErrorCodes.EmailAlreadyInUseError,
    });
  }
}
