import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserResolver } from './resolvers/user.resolver.js';
import { UserRepositoy } from './repository/user.respository.js';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver, UserRepositoy], // inhject to use within the module
  exports: [UserService, UserRepositoy], // we export here to use with AuthService
})
export class UserModule {}
