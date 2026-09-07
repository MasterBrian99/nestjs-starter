import { applyDecorators } from '@nestjs/common';
import { TemplatedApiException } from './templated-api-exception.decorator.js';
import { ResourceConflictException } from '../exceptions/resource-conflict.exception.js';

export function ApiResourceConflictException() {
  return applyDecorators(
    TemplatedApiException(() => ResourceConflictException, {
      description: 'Resource exists',
    }),
  );
}
