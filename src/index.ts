import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { hashPassword } from 'utils/bcrypt';
import app from 'app';
const { env } = process;
export const server = async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: env.DATABASE_HOST || 'localhost',
      port: Number(env.DATABASE_PORT) || 5432,
      username: env.DATABASE_USERNAME || 'clintonagada',
      password: env.DATABASE_PASSWORD || '',
      database: env.DATABASE_NAME || 'archimydes',
      entities: ['src/entities/**/*.ts'],
      synchronize: true,
    });
    const port = env.PORT || 3000;

    // start express server
    app.listen(port);

    // seed new users for test if not seeded yet
    const seeded = await connection.manager.find('User', {
      email: 'admin@active-stories.com',
    });
    if (!seeded.length) {
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
        })
      );
    }
    console.log(`Express server has started on port ${port}`);
  } catch (error) {
    console.log(error);
  }
};

server();

export default app;
