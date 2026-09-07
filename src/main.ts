import {
  StandardSchemaValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { BaseExceptionsFilter } from './common/filters/base-exception.filter.js';
import { ValidationException } from './common/exceptions/validation.exception.js';
import { AllExceptionsFilter } from './common/filters/all-exception.filter.js';
import rawBodyMiddleware from './utils/rawBody.middleware.js';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    snapshot: true,
    // v12 route conflict diagnostics: fail on duplicates, warn when a
    // parametric route (e.g. `:id`) can shadow a literal one (e.g. `me`).
    routeConflictPolicy: { duplicate: 'error', shadow: 'warn' },
    routeResolutionStrategy: 'specificity',
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const logger = app.get(Logger);
  const corsMaxAge = configService.getOrThrow<number>('corsMaxAge');

  const helmetContentSecurityPolicy = {
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'unpkg.com',
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
      ],
      connectSrc: [`'self'`, `unpkg.com`],
      fontSrc: [`'self'`, 'fonts.gstatic.com'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
      scriptSrc: [
        `'self'`,
        `'unsafe-eval'`,
        `https: 'unsafe-inline'`,
        `cdn.jsdelivr.net`,
        `unpkg.com`,
      ],
    },
  };

  app.useLogger(app.get(Logger));
  app.use(
    helmet({
      contentSecurityPolicy: helmetContentSecurityPolicy,
    }),
    rawBodyMiddleware({}),
  );
  app.enableCors({
    maxAge: corsMaxAge,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new AllExceptionsFilter(), new BaseExceptionsFilter());
  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      exceptionFactory: (issues) => {
        return new ValidationException(issues);
      },
    }),
  );

  app.setGlobalPrefix('api');

  const openApiConfig = new DocumentBuilder()
    .setTitle('WaveZync NestJS starter')
    .setDescription('WaveZync NestJS starter')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'path',
      name: 'X-Api-Version',
      required: false,
      description: 'API Version',
    })
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api-docs', app, document, {
    ui: false,
  });

  app.use('/api-docs', apiReference({ content: document }));

  await app.listen(port, () => {
    logger.log(`Application started at port:${port}`);
  });
}
void bootstrap();
