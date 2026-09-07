/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [DatabaseModule, TerminusModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
