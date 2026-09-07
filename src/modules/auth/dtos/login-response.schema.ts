import { z } from 'zod';

// Runtime response schema for the StandardSchemaSerializerInterceptor.
// Uses `z.object` (strip unknown keys) so sensitive fields like
// `passwordHash` never leak even if a raw UserModel reaches the serializer.
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  verified: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: userResponseSchema,
});

export const currentUserSchema = z.object({
  user: userResponseSchema,
});
