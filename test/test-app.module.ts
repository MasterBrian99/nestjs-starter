import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JwtGuard } from '../src/common/guards/index.js';
import { AppConfig, LoggerConfig, LoggerFormat } from '../src/config/configuration.js';
import { DatabaseModule } from '../src/database/database.module.js';
import { AuthModule } from '../src/modules/auth/auth.module.js';
import { HealthModule } from '../src/modules/health/health.module.js';
import { UserModule } from '../src/modules/user/user.module.js';
import { Logger, LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'test',
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>) => {
        const loggerConfig = config.get<LoggerConfig>('logger');

        return {
          pinoHttp: {
            level: loggerConfig.level,
            transport:
              loggerConfig.format === LoggerFormat.Pretty
                ? { target: 'pino-pretty' }
                : undefined,
            useLevelLabels: true,
            formatters: {
              level: (label: string) => {
                return { level: label };
              },
            },
            autoLogging: false,
          },
        };
      },
    }),
    DatabaseModule,

    // Http modules
    AuthModule,
    UserModule,
    HealthModule,
  ],
  providers: [
    Logger,
    // we set all routes to be private by default
    // use `@Public()` to make them public
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class TestAppModule {}
