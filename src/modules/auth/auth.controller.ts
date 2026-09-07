import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import {
  SerializeOptions,
  StandardSchemaSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public, CurrentUser } from '../../common/decorators/index.js';
import { AuthService } from './auth.service.js';
import { UserModel } from '../user/models/user.model.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { loginSchema, type LoginDto } from './dtos/login.schema.js';
import {
  currentUserSchema,
  loginResponseSchema,
} from './dtos/login-response.schema.js';
import { CurrentUserDto } from './dtos/current-user.dto.js';
import { ApiUnauthorizedException } from '../../common/decorators/api-unauthorized-exception.decorator.js';
import { TemplatedApiException } from '../../common/decorators/templated-api-exception.decorator.js';
import { InvalidLoginOrPasswordException } from './exceptions/invalid-login-or-password.exception.js';
import { ApiUnknownErrorException } from '../../common/decorators/api-unknown-error-exception.decorator.js';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Login the user to the system',
    summary: 'Login to the system',
  })
  @TemplatedApiException(() => new InvalidLoginOrPasswordException())
  @ApiUnknownErrorException()
  @UseInterceptors(StandardSchemaSerializerInterceptor)
  @SerializeOptions({ schema: loginResponseSchema })
  login(
    @Body({ schema: loginSchema }) loginDto: LoginDto,
  ): Promise<LoginResponseDto | undefined> {
    return this.authService.loginUser(loginDto);
  }

  @Get('/me')
  @ApiBearerAuth()
  @ApiUnknownErrorException()
  @ApiUnauthorizedException()
  @UseInterceptors(StandardSchemaSerializerInterceptor)
  @SerializeOptions({ schema: currentUserSchema })
  async me(@CurrentUser() user: UserModel): Promise<CurrentUserDto> {
    return { user: user.toDto() };
  }
}
