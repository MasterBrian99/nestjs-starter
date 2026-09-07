import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
  /**
   * Email of user
   *
   * @example jhonedoe@example.com
   * @type {string}
   * @memberof RegisterUserInput
   */
  @Field(() => String)
  email!: string;

  /**
   * Password for user
   *
   * @example abc@123
   * @type {string}
   * @memberof RegisterUserInput
   */
  @Field(() => String)
  password!: string;
}
