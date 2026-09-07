import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  SerializeOptions,
  StandardSchemaSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { type RegisterUserDto } from './dtos/register-user.schema.js';
import { registerUserSchema } from './dtos/register-user.schema.js';
import { MessageDto } from '../../common/dtos/message.dto.js';
import { messageSchema } from '../../common/dtos/message.schema.js';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/index.js';
import { ApiValidationException } from '../../common/decorators/api-validation-exception.decorator.js';
import { ApiUnknownErrorException } from '../../common/decorators/api-unknown-error-exception.decorator.js';
import { TemplatedApiException } from '../../common/decorators/templated-api-exception.decorator.js';
import { EmailAlreadyTakenException } from './exceptions/email-already-taken.exception.js';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @Public()
  @ApiValidationException()
  @TemplatedApiException(
    () => new EmailAlreadyTakenException('jhonedoes@example.com'),
  )
  @ApiUnknownErrorException()
  @ApiCreatedResponse({
    type: MessageDto,
    description: 'User account created',
  })
  @ApiOperation({
    description: 'Registers a new user account and sends a confirmation',
    summary: 'Register a new user',
  })
  @UseInterceptors(StandardSchemaSerializerInterceptor)
  @SerializeOptions({ schema: messageSchema })
  async register(
    @Body({ schema: registerUserSchema }) registerUserDto: RegisterUserDto,
  ): Promise<MessageDto> {
    await this.userService.registerUser(registerUserDto);

    return { message: 'Account created' };
  }
}
