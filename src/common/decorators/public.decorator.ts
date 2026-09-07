import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = Reflector.createDecorator<boolean>({
  key: IS_PUBLIC_KEY,
  transform: (value) => value ?? true,
});
