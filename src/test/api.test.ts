import * as request from 'supertest';
import app from '../app';
import { createConnection, Connection } from 'typeorm';
import { hashPassword } from 'utils/bcrypt';

describe('Testing API Endpoints', () => {
  let connection: Connection;
  const { env } = process;
  let token = '';
  let otherToken = '';
  let adminToken = '';
  beforeAll(async () => {
    connection = await createConnection({
      type: 'postgres',
      host: env.DATABASE_HOST || 'localhost',
      port: Number(env.DATABASE_PORT) || 5432,
      username: env.DATABASE_USERNAME || 'clintonagada',
      password: env.DATABASE_PASSWORD || '',
      database: env.DATABASE_NAME_TEST || 'archimydes-test',
      synchronize: true,
      entities: ['src/entities/**/*.ts'],
    });
    const hashed = await hashPassword('password');

    await connection.manager.save(
      connection.manager.create('User', {
        email: 'admin@active-stories.com',
        password: hashed,
        userRole: 'admin',
      })
    );

    await connection.manager.save(
      connection.manager.create('User', {
        email: 'user@active-stories.com',
        password: hashed,
        userRole: 'user',
      })
    );
  });
  afterAll(async () => {
    await connection.close();
  });
  describe('Post /api/signup', () => {
    it('should create a user and return a token', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          email: 'user@test.test',
          password: 'password',
        });
      ({ token } = response.body.data);
      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('data.token');
    });
    it('should fail if no email or password', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          email: 'user@test.test',
        });
      expect(response.status).toEqual(400);
      expect(response.body.data).toEqual(null);
    });
    it('should fail if user with the email already exists', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          email: 'user@test.test',
          password: 'password',
        });
      expect(response.status).toEqual(409);
    });
  });
  describe('Post /api/login', () => {
    it('should login a user and return a token', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'user@active-stories.com',
          password: 'password',
        });
      otherToken = response.body.data.token;
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('data.token');
    });
    it('should fail if no email or password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          password: 'password',
        });
      expect(response.status).toEqual(400);
    });
    it('should fail if wrong password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'user@test.test',
          password: 'passwordss',
        });
      expect(response.status).toEqual(401);
    });
    it('should fail if user is not registered', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'userhhh@test.test',
          password: 'password',
        });
      expect(response.status).toEqual(401);
    });
  });
  describe('Post /api/adminLogin', () => {
    it('should login an admin and return a token', async () => {
      const response = await request(app)
        .post('/api/adminLogin')
        .send({
          email: 'admin@active-stories.com',
          password: 'password',
        });
      adminToken = response.body.data.token;
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('data.token');
    });
    it('should fail if user is not an admin', async () => {
      const response = await request(app)
        .post('/api/adminLogin')
        .send({
          email: 'user@test.test',
          password: 'password',
        });
      expect(response.status).toEqual(403);
    });
  });
  describe('Post /api/createStory', () => {
    it('should create a story and return it', async () => {
      const response = await request(app)
        .post('/api/createStory')
        .set('x-access-token', token)
        .send({
          summary: 'A useful test story',
          description: 'The description could be anything that adds context',
          type: 'enhancement',
          complexity: 'Hard',
          cost: 8,
        });
      expect(response.status).toEqual(200);
    });
    it('should fail if user is not logged in', async () => {
      const response = await request(app)
        .post('/api/createStory')
        .send({
          summary: 'A useful test story',
          description: 'The description could be anything that adds context',
          type: 'enhancement',
          complexity: 'Hard',
          cost: 8,
        });
      expect(response.status).toEqual(401);
    });
    it('should fail if user token is invalid or expired', async () => {
      const response = await request(app)
        .post('/api/createStory')
        .set('x-access-token', `${token}hh`)
        .send({
          summary: 'A useful test story',
          description: 'The description could be anything that adds context',
          type: 'enhancement',
          complexity: 'Hard',
          cost: 8,
        });
      expect(response.status).toEqual(401);
    });
    it('should fail if any of the required fields is missing', async () => {
      const response = await request(app)
        .post('/api/createStory')
        .set('x-access-token', token)
        .send({
          summary: 'A useful test story that will fail',
          description: 'The description could be anything that adds context',
          type: 'enhancement',
        });
      expect(response.status).toEqual(400);
    });
    it('should fail if cost is not one of the allowed values', async () => {
      const response = await request(app)
        .post('/api/createStory')
        .set('x-access-token', token)
        .send({
          summary: 'A useful test story',
          description: 'The description could be anything that adds context',
          type: 'enhancement',
          complexity: 'Hard',
          cost: 10,
        });
      expect(response.status).toEqual(400);
    });
  });
  describe('Get /api/getStory/{id}', () => {
    it('should retrieve story for admin or owner', async () => {
      const response = await request(app)
        .get('/api/getStory/1')
        .set('x-access-token', adminToken);
      expect(response.status).toEqual(200);
    });
    it('should fail if user is not the owner', async () => {
      const response = await request(app)
        .get('/api/getStory/1')
        .set('x-access-token', otherToken);
      expect(response.status).toEqual(403);
    });
    it('should fail if ID is not a number', async () => {
      const response = await request(app)
        .get('/api/getStory/love')
        .set('x-access-token', token);
      expect(response.status).toEqual(400);
    });
    it('should fail if story does not exist', async () => {
      const response = await request(app)
        .get('/api/getStory/10')
        .set('x-access-token', token);
      expect(response.status).toEqual(404);
    });
  });
  describe('Put /api/updateStory/{id}', () => {
    it('should approve/reject a story for admin', async () => {
      const response = await request(app)
        .put('/api/updateStory/1')
        .set('x-access-token', adminToken)
        .send({
          status: 'approved',
        });
      expect(response.status).toEqual(200);
    });
    it('should fail if user is not an admin', async () => {
      const response = await request(app)
        .put('/api/updateStory/1')
        .set('x-access-token', token)
        .send({
          status: 'approved',
        });
      expect(response.status).toEqual(403);
    });
    it('should fail if ID is not a number', async () => {
      const response = await request(app)
        .put('/api/updateStory/love')
        .set('x-access-token', adminToken)
        .send({
          status: 'approved',
        });
      expect(response.status).toEqual(400);
    });
    it('should fail if no status in the body', async () => {
      const response = await request(app)
        .put('/api/updateStory/1')
        .set('x-access-token', adminToken);
      expect(response.status).toEqual(400);
    });
    it('should fail if story does not exist', async () => {
      const response = await request(app)
        .put('/api/updateStory/10')
        .set('x-access-token', adminToken)
        .send({
          status: 'approved',
        });
      expect(response.status).toEqual(404);
    });
    it("should fail if status in body is neither 'approved' nor 'rejected'", async () => {
      const response = await request(app)
        .put('/api/updateStory/1')
        .set('x-access-token', adminToken)
        .send({
          status: 'disapproved',
        });
      expect(response.status).toEqual(400);
    });
  });
  describe('Get /api/getStories', () => {
    it('should retrieve all stories for an admin', async () => {
      const response = await request(app)
        .get('/api/getStories')
        .set('x-access-token', adminToken);
      expect(response.status).toEqual(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
    it('should return only stories belonging to a user', async () => {
      const response = await request(app)
        .get('/api/getStories')
        .set('x-access-token', otherToken);
      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(0);
    });
  });
});
