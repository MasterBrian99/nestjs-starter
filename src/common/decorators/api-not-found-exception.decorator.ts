import { applyDecorators } from '@nestjs/common';
import { TemplatedApiException } from './templated-api-exception.decorator.js';
import { NotFoundException } from '../exceptions/not-found.exception.js';

export function ApiNotFoundException(resouce?: string | number) {
  return applyDecorators(
    TemplatedApiException(() => new NotFoundException(resouce || 'resouce'), {
      description: 'Resource not found',
    }),
  );
}
