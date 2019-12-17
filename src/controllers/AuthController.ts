import { NextFunction, Request, Response } from 'utils/types';
import { hashPassword, comparePassword } from 'utils/bcrypt';
import { UserRepository } from 'respositories/UserRepository';
import { createToken } from 'utils/jwt';
import { getRepository } from 'typeorm';
import { User } from 'entities/User';

export class AuthController {
  private repository = getRepository(User);

  private userRepository = new UserRepository(this.repository);

  async signup(request: Request, response: Response, next: NextFunction) {
    const { email, password: plainPassword } = request.body;

    if (!email || !plainPassword) {
      response.statusCode = 400;
      return next(new Error('Please provide an email and password'));
    }
    try {
      const password = await hashPassword(plainPassword);
      const existing = await this.userRepository.findOne({ email });
      if (existing) {
        response.statusCode = 409;
        return next(
          new Error(
            'A user with this email already exists. Please use another email'
          )
        );
      }
      const user = (await this.userRepository.save({
        email,
        password,
      })) as User;
      response.statusCode = 201;
      const { password: removed, ...signedUpUser } = user;

      const { id, userRole } = signedUpUser;
      const token = createToken({ id, userRole });

      return {
        message: 'Login successful',
        data: {
          user: signedUpUser,
          token,
        },
      };
    } catch (error) {
      return next(new Error(error.message));
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const {
      route: { path },
      body,
    } = request;
    const { email, password: plainPassword } = body;

    const message = 'Email and/or password is invalid!';

    if (!email || !plainPassword) {
      response.statusCode = 400;
      return next(new Error('Please provide an email and password'));
    }
    try {
      const user = (await this.userRepository.query('email', {
        email,
      })) as User;
      if (!user) {
        response.statusCode = 401;
        return next(new Error(message));
      }

      if (path.includes('admin-login') && user.userRole !== 'admin') {
        response.statusCode = 403;
        return next(
          new Error(
            "You don't have the permission to login as an admin! Login normally"
          )
        );
      }
      const validLogin = await comparePassword(plainPassword, user.password);
      if (!validLogin) {
        response.statusCode = 401;
        return next(new Error(message));
      }
      const { password, ...loggedInUser } = user;

      const { id, userRole } = loggedInUser;
      const token = createToken({ id, userRole });

      return {
        message: 'Login successful',
        data: {
          user: loggedInUser,
          token,
        },
      };
    } catch (error) {
      response.statusCode = 500;
      return next(new Error(error.message));
    }
  }
}
