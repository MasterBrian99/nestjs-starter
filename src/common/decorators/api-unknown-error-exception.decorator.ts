import { applyDecorators } from '@nestjs/common';
import { TemplatedApiException } from './templated-api-exception.decorator.js';
import { UnknownErrorException } from '../exceptions/unknown-error.exception.js';

export function ApiUnknownErrorException() {
  return applyDecorators(
    TemplatedApiException(() => new UnknownErrorException(), {
      description: 'Internal Server Error',
    }),
  );
}
