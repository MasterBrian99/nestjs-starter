import { registerUserSchema } from './register-user.schema.js';
import { loginSchema } from '../../auth/dtos/login.schema.js';

describe('registerUserSchema', () => {
  it('accepts a valid payload', () => {
    const result = registerUserSchema.safeParse({
      email: 'jhonedoe@example.com',
      password: 'abc@123',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid, missing, or empty fields', () => {
    expect(
      registerUserSchema.safeParse({ email: 'invalid-email', password: 'x' })
        .success,
    ).toBe(false);
    expect(registerUserSchema.safeParse({ password: 'x' }).success).toBe(
      false,
    );
    expect(
      registerUserSchema.safeParse({ email: 'a@b.com', password: '' }).success,
    ).toBe(false);
  });

  it('rejects emails with a local part longer than 64 characters', () => {
    const result = registerUserSchema.safeParse({
      email: `${'a'.repeat(200)}@example.com`,
      password: 'abc@123',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a valid payload and rejects empty fields', () => {
    expect(
      loginSchema.safeParse({ login: 'a@b.com', password: 'secret' }).success,
    ).toBe(true);
    expect(loginSchema.safeParse({ login: 'a@b.com' }).success).toBe(false);
    expect(loginSchema.safeParse({ login: '', password: 's' }).success).toBe(
      false,
    );
  });
});
