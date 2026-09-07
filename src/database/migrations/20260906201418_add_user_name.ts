import { Kysely } from 'kysely';
import { DB } from '../schema/db.js';

const tableName = 'users';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable(tableName)
    .addColumn('name', 'text')
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.alterTable(tableName).dropColumn('name').execute();
}
