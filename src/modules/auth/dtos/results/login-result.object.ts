import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { TokensObject } from '../objects/tokens.object.js';
import { UserNotFoundError } from '../../../user/dtos/errors/user-not-found-error.object.js';

@ObjectType()
export class LoginSuccess {
  /**
   * Login related tokens
   *
   * @type {TokensObject}
   * @memberof LoginSuccess
   */
  @Field(() => TokensObject)
  tokens!: TokensObject;
}

export const LoginResult = createUnionType({
  name: 'LoginResult',
  description: 'Login result',
  types: () => [LoginSuccess, UserNotFoundError],
});
