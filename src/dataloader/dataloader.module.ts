import { DataloaderService } from './dataloader.service.js';
import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module.js';

@Module({
  imports: [UserModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
