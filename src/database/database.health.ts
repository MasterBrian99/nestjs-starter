import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { KYSELY_CONNECTION } from './consts.js';
import { Kysely, sql } from 'kysely';
import { DB } from './schema/db.js';

const KEY = 'database';

@Injectable()
export class DatabaseHealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);

  constructor(
    @Inject(KYSELY_CONNECTION) private db: Kysely<DB>,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(KEY);
    try {
      await sql`select 1+1 AS result`.execute(this.db);
      return indicator.up();
    } catch (error) {
      this.logger.error(error, 'Database connection failed');
      return indicator.down({
        message: 'Database connection failed',
      });
    }
  }
}
