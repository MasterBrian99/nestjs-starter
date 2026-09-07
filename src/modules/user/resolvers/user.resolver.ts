import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, Public } from '../../../common/decorators/index.js';
import { UserObject } from '../dtos/objects/user.object.js';
import {
  UserRegistrationResult,
  UserRegistrationSuccess,
} from '../dtos/results/registration-result.object.js';
import { UserService } from '../user.service.js';

import { EmailAlreadyTakenException } from '../exceptions/email-already-taken.exception.js';
import { EmailAlreadyTakenError } from '../dtos/errors/email-already-taken-error.object.js';
import { RegisterUserInput } from '../dtos/inputs/register-user.input.js';
import { registerUserSchema } from '../dtos/register-user.schema.js';
import { ValidationException } from '../../../common/exceptions/validation.exception.js';
import type { User } from '../../../database/schema/users.js';
import { UserModel } from '../models/user.model.js';

@Resolver(() => UserObject)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserObject, {
    name: 'me',
    description: 'Get current user',
  })
  getMe(@CurrentUser() user: User): UserObject {
    return new UserModel(user).toDto();
  }

  @Public()
  @Mutation(() => UserRegistrationResult, {
    description: 'Register user account',
  })
  async registerUser(
    @Args('input') input: RegisterUserInput,
  ): Promise<typeof UserRegistrationResult> {
    const parsed = registerUserSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationException(parsed.error.issues);
    }

    try {
      await this.userService.registerUser(parsed.data);
      const result = new UserRegistrationSuccess();
      result.message = 'Success';
      return result;
    } catch (error) {
      if (error instanceof EmailAlreadyTakenException) {
        return Object.assign(new EmailAlreadyTakenError(), {
          message: error.message,
        });
      }
      throw error;
    }
  }
}
