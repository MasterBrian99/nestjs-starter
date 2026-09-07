import { createUnionType, ObjectType } from '@nestjs/graphql';
import { EmailAlreadyTakenError } from '../errors/email-already-taken-error.object.js';

@ObjectType()
export class UserRegistrationSuccess {
  message: string;
}

export const UserRegistrationResult = createUnionType({
  name: 'UserRegistrationResult',
  description: 'User registration result',
  types: () => [UserRegistrationSuccess, EmailAlreadyTakenError],
});
