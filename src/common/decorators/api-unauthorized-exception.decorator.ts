import { applyDecorators } from '@nestjs/common';
import { TemplatedApiException } from './templated-api-exception.decorator.js';
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';

export function ApiUnauthorizedException() {
  return applyDecorators(
    TemplatedApiException(() => new UnauthorizedException(), {
      description: 'Unauthorized',
    }),
  );
}
