import { z } from 'zod';

// Mirrors the previous class-validator `@IsEmail()` semantics (validator.js
// rejects local parts longer than 64 characters).
const emailSchema = z
  .email()
  .refine((value) => value.split('@')[0]!.length <= 64, {
    message: 'Invalid email',
  });

export const registerUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
