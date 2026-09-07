import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { Public } from '../../../common/decorators/index.js';
import { AuthService } from '../auth.service.js';
import { LoginResult, LoginSuccess } from '../dtos/results/login-result.object.js';
import { LoginInput } from '../dtos/inputs/login.input.js';
import { TokensObject } from '../dtos/objects/tokens.object.js';
import { loginSchema } from '../dtos/login.schema.js';
import { ValidationException } from '../../../common/exceptions/validation.exception.js';
import { InvalidLoginOrPasswordException } from '../exceptions/invalid-login-or-password.exception.js';
import { InvalidLoginOrPasswordError } from '../dtos/errors/invalid-login-or-password-error.object.js';

@Injectable()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResult, {
    description: 'Login with email/password',
  })
  async loginWithPassword(
    @Args('input') input: LoginInput,
  ): Promise<typeof LoginResult> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationException(parsed.error.issues);
    }

    try {
      const { accessToken } = await this.authService.loginUser(parsed.data);
      const result = new LoginSuccess();
      const tokenObject = new TokensObject();
      tokenObject.accessToken = accessToken;

      result.tokens = tokenObject;

      return result;
    } catch (error) {
      if (error instanceof InvalidLoginOrPasswordException) {
        return Object.assign(new InvalidLoginOrPasswordError(), {
          message: error.message,
        });
      }

      throw error;
    }
  }
}
