import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseHealthIndicator } from './database.health.js';
import { databaseProviders } from './database.provider.js';
import { DatabaseService } from './database.service.js';
import { TerminusModule } from '@nestjs/terminus';

@Global()
@Module({
  imports: [ConfigModule, TerminusModule],
  providers: [...databaseProviders, DatabaseHealthIndicator, DatabaseService],
  exports: [...databaseProviders, DatabaseHealthIndicator, DatabaseService],
})
export class DatabaseModule {}
