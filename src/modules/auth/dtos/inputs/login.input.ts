import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  /**
   * Login should be email or username
   *
   * @example jhonedoe@example.com
   * @type {string}
   * @memberof LoginInput
   */
  @Field(() => String)
  login!: string;

  /**
   * Password of user
   *
   * @example abc@123
   * @type {string}
   * @memberof LoginInput
   */
  @Field(() => String)
  password!: string;
}
