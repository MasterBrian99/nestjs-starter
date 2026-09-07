import { BaseException } from '../../../common/exceptions/base.exception.js';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../../../common/errors/error-codes.js';

export class UserNotFoundException extends BaseException {
  constructor() {
    super('User account does not exists', HttpStatus.UNAUTHORIZED, {
      errorCode: ErrorCodes.UserAccountNotFoundError,
    });
  }
}
