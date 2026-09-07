import { z } from 'zod';

// Runtime response schema for the StandardSchemaSerializerInterceptor.
// Fields are intentionally lenient (`name` is optional — the backing table
// currently has no `name` column) so serialization never breaks reads.
export const userResponseSchema = z.looseObject({
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
