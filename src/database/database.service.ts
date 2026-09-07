import { Inject, Injectable } from '@nestjs/common';
import { KYSELY_CONNECTION } from './consts.js';
import { Kysely } from 'kysely';
import { DB } from './schema/db.js';

@Injectable()
export class DatabaseService {
  constructor(@Inject(KYSELY_CONNECTION) private db: Kysely<DB>) {}

  getDB(): Kysely<DB> {
    return this.db;
  }
}
