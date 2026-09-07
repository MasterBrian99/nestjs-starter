import { HttpException } from '@nestjs/common';

export interface BaseExceptionOptions {
  errorCode?: string;
  errors?: any;
}

/**
 * Api Exception class
 *
 * @export
 * @class ApiException
 * @extends {HttpException}
 */
export class BaseException extends HttpException {
  extra: BaseExceptionOptions;

  constructor(
    message: string | Record<string, any>,
    status = 500,
    options: BaseExceptionOptions = {},
  ) {
    // v12: errorCode is passed natively so it is serialized into the
    // response body even without a custom filter.
    super(message, status, { errorCode: options.errorCode });
    this.extra = options;
  }
}
