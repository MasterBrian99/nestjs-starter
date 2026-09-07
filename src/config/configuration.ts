// Define the app config here

import { z } from 'zod';

// You can inject it to anywhere via ConfigService
export interface AppConfig {
  port: number;
  secret: string;
  database: DatabaseConfig;
  logger: LoggerConfig;
  isDevEnv: boolean;
  corsMaxAge: number;
}

export interface DatabaseConfig {
  url: string;
  poolSize: number;
}

export enum LoggerFormat {
  Json = 'json',
  Pretty = 'pretty',
}

export interface LoggerConfig {
  level: string;
  format: LoggerFormat;
}

// Standard Schema validation for `@nestjs/config` (`validationSchema`).
// Validated values are assigned back onto `process.env` by the config module.
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SECRET: z.string().min(1),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  POOL_SIZE: z.coerce.number().int().positive().default(15),
  LOGGER_LEVEL: z.enum(['info', 'debug', 'error', 'warn']).default('info'),
  LOGGER_FORMAT: z.enum(['json', 'pretty']).default('json'),
  CORS_MAX_AGE: z.coerce.number().int().nonnegative().default(86400),
});

export type EnvConfig = z.infer<typeof envSchema>;

export default (): AppConfig => {
  // validate env vars (also enforced upfront via ConfigModule validationSchema)
  const env = envSchema.parse(process.env);

  const config: AppConfig = {
    port: env.PORT,
    secret: env.SECRET,
    database: {
      url: env.DATABASE_URL,
      poolSize: env.POOL_SIZE,
    },
    logger: {
      level: env.LOGGER_LEVEL,
      format: env.LOGGER_FORMAT as LoggerFormat,
    },
    isDevEnv: env.NODE_ENV !== 'production',
    corsMaxAge: env.CORS_MAX_AGE,
  };

  return config;
};
