import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../../common/exceptions/base.exception.js';
import { ErrorCodes } from '../../../common/errors/error-codes.js';

export class InvalidLoginOrPasswordException extends BaseException {
  constructor() {
    super('Invalid login or password', HttpStatus.UNAUTHORIZED, {
      errorCode: ErrorCodes.InvalidLoginOrPasswordError,
    });
  }
}
