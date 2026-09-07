import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { DB } from '../../src/database/schema/db.js';
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Migrator, type MigrationProvider } from 'kysely/migration';
import { Pool } from 'pg';
// NOTE: migrations are imported statically (instead of kysely's
// FileMigrationProvider) so they go through vite's transform pipeline,
// which resolves the ESM `.js` specifiers to their `.ts` sources.
// Add new migrations to this map when they are created.
import * as createUsers from '../../src/database/migrations/20250214040802_create_users.js';
import * as addUserName from '../../src/database/migrations/20260906201418_add_user_name.js';

const testMigrations: MigrationProvider = {
  getMigrations: async () => ({
    '20250214040802_create_users': createUsers,
    '20260906201418_add_user_name': addUserName,
  }),
};

/**
 * This class manages a PostgreSQL container for testing purposes.
 * It ensures that the container is started only once and provides methods
 * to run migrations and stop the container.
 */
export class PostgresContainer {
  private static instance: StartedPostgreSqlContainer | null = null;

  static async getInstance(): Promise<StartedPostgreSqlContainer> {
    if (!PostgresContainer.instance) {
      const container = await new PostgreSqlContainer(
        'postgres:16-alpine',
      ).start();
      PostgresContainer.instance = container;

      const db = new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: `${container.getConnectionUri()}?sslmode=disable`,
            max: 5,
          }),
        }),
        plugins: [new CamelCasePlugin()],
      });
      await this.runMigrations(db);
      await db.destroy();
    }
    return PostgresContainer.instance;
  }

  static async stop(): Promise<void> {
    if (PostgresContainer.instance) {
      await PostgresContainer.instance.stop();
      PostgresContainer.instance = null;
    }
  }

  static async runMigrations(db: Kysely<DB>): Promise<void> {
    console.log('Running migrations...');

    try {
      const migrator = new Migrator({
        db,
        provider: testMigrations,
        allowUnorderedMigrations: true,
      });

      const { error, results } = await migrator.migrateToLatest();

      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(
            `Migration "${it.migrationName}" was executed successfully`,
          );
        } else if (it.status === 'Error') {
          console.error(`Failed to execute migration "${it.migrationName}"`);
        }
      });

      if (error) {
        console.error('Failed to migrate:', error);
        throw error;
      }

      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
}
