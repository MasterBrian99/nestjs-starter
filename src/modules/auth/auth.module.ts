import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration.js';
import { AuthResolver } from './resolvers/auth.resolver.js';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        secret: configService.get<string>('secret'),
      }),
    }),
  ], // import user module
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
