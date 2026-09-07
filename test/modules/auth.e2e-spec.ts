import { INestApplication, StandardSchemaValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TestModuleFactory } from '../factory/test-module.factory.js';
import { ValidationException } from '../../src/common/exceptions/validation.exception.js';
import { BaseExceptionsFilter } from '../../src/common/filters/base-exception.filter.js';
import { AllExceptionsFilter } from '../../src/common/filters/all-exception.filter.js';
import MOCK_USERS from '../mocks/user-mocks.js';
import request from 'supertest';
import { PostgresContainer } from '../utils/postgres-container.js';

describe('AuthModule', () => {
  let testingModule: TestingModule;
  let app: INestApplication;
  let registeredUser: { email: string; password: string };
  let authToken = '';
  beforeAll(async () => {
    const postgresContainer = await PostgresContainer.getInstance();

    testingModule = await TestModuleFactory.createTestModule(
      postgresContainer.getConnectionUri(),
    );
    app = testingModule.createNestApplication();

    app.useGlobalFilters(new AllExceptionsFilter(), new BaseExceptionsFilter());
    app.useGlobalPipes(
      new StandardSchemaValidationPipe({
        exceptionFactory: (issues) => {
          return new ValidationException(issues);
        },
      }),
    );

    await app.init();
  }, 60000);

  afterAll(async () => {
    await app.close();
  }, 60000);
  const generateValidUserDto = () => ({
    email: MOCK_USERS.user2.email,
    password: MOCK_USERS.user2.password,
  });
  describe('Authentication Flow', () => {
    beforeAll(async () => {
      // Ensure we have a registered user for login tests
      if (!registeredUser) {
        registeredUser = generateValidUserDto();
        await request(app.getHttpServer())
          .post('/users/register')
          .send(registeredUser)
          .expect(201);
      }
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: registeredUser.email,
            password: registeredUser.password,
          })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty(
          'email',
          registeredUser.email.toLowerCase(),
        );

        authToken = response.body.accessToken;
      });

      it('should return 401 with invalid email', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: 'nonexistent@example.com',
            password: registeredUser.password,
          })
          .expect(401);

        expect(response.body.message).toContain('Invalid login or password');
      });

      it('should return 401 with invalid password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: registeredUser.email,
            password: 'wrongpassword',
          })
          .expect(401);

        expect(response.body.message).toContain('Invalid login or password');
      });

      it('should return 400 when login is missing', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            password: registeredUser.password,
          })
          .expect(400);

        expect(response.body.message).toBe('Validation Failed');
        expect(response.body.errors).toBeDefined();
      });

      it('should return 400 when password is missing', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: registeredUser.email,
          })
          .expect(400);

        expect(response.body.message).toBe('Validation Failed');
        expect(response.body.errors).toBeDefined();
      });
    });

    describe('GET /auth/me', () => {
      it('should return current user when authenticated', async () => {
        const response = await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty(
          'email',
          registeredUser.email.toLowerCase(),
        );
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).not.toHaveProperty('passwordHash');
      });

      it('should return 401 when not authenticated', async () => {
        const response = await request(app.getHttpServer())
          .get('/auth/me')
          .expect(401);

        expect(response.body.message).toContain('Unauthorized');
      });

      it('should return 401 with malformed authorization header', async () => {
        const response = await request(app.getHttpServer())
          .get('/auth/me')
          .set('Authorization', 'InvalidFormat')
          .expect(401);

        expect(response.body.message).toContain('Unauthorized');
      });
    });
  });
});
