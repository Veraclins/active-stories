import { NextFunction, Request, Response } from 'utils/types';
import { Route } from 'routes';
import { verifyToken } from 'utils/jwt';

export const auth = (route: Route) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (route.type === 'public') {
      return next();
    }
    const { headers } = request;
    const hasToken = headers['x-access-token'] || headers.authorization;
    if (!hasToken) {
      response.statusCode = 401;
      return next(new Error('Please provide an authentication header!'));
    }

    const token =
      (headers['x-access-token'] as string) ||
      headers.authorization.replace('Bearer ', '');

    const decoded = verifyToken(token);
    if (!decoded) {
      response.statusCode = 401;
      return next(
        new Error('You access token is invalid or expired. Please login again!')
      );
    }
    request.user = { id: decoded.id, userRole: decoded.userRole };
    return next();
  };
};
