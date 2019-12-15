import 'dotenv/config';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import { auth } from 'middlewares/auth';
import { Route, Routes } from 'routes';
// create express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register middlewares
const middlewares = (route: Route) => {
  return [auth(route)];
};

// register express routes from defined application routes
Routes.forEach(route => {
  (app as any)[route.method](
    `/api${route.route}`,
    ...middlewares(route),
    (req: Request, res: Response, next: Function) => {
      const controller = new (route.controller as any)();
      const result = controller[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then(final =>
          final !== null && final !== undefined ? res.json(final) : undefined
        );
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }
  );
});

// create an error handler
app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  res.statusCode = res.statusCode || 500;
  res.json({
    message:
      err.message || 'Something is not quite right! Please try again later',
    data: null,
  });
});

export default app;
