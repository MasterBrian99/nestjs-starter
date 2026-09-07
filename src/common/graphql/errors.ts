import { ValidationException } from '../exceptions/index.js';
import { GraphQLFormattedError } from 'graphql';
import jsonwebtoken from 'jsonwebtoken';

const { TokenExpiredError: TokenExpiredErrorClass } = jsonwebtoken;
type TokenExpiredError = InstanceType<typeof TokenExpiredErrorClass>;
import { UnauthorizedException } from '../exceptions/unauthorized.exception.js';
import { AuthenticationError, UserInputError } from '@nestjs/apollo';
import { unwrapResolverError } from '@apollo/server/errors';

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  err: unknown,
): GraphQLFormattedError {
  if (unwrapResolverError(err) instanceof ValidationException) {
    const extensions = {
      errors: err,
    };

    return new UserInputError('Validation failed', { extensions });
  }

  if (unwrapResolverError(err) instanceof UnauthorizedException) {
    const e = unwrapResolverError(err) as UnauthorizedException;
    const extensions = {
      code: 'UNAUTHENTICATED',
    };

    return new AuthenticationError(e.message, { extensions });
  }

  if (unwrapResolverError(err) instanceof TokenExpiredErrorClass) {
    const e = unwrapResolverError(err) as TokenExpiredError;
    const extensions = {
      code: 'UNAUTHENTICATED',
    };

    return new AuthenticationError(e.message, { extensions });
  }

  return formattedError;
}
