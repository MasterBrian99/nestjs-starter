import { applyDecorators } from '@nestjs/common';
import { TemplatedApiException } from './templated-api-exception.decorator.js';
import { ValidationException } from '../exceptions/validation.exception.js';

export function ApiValidationException() {
  return applyDecorators(
    TemplatedApiException(() => new ValidationException([]), {
      description: 'Validation Failed',
    }),
  );
}
