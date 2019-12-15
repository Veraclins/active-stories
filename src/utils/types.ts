import { NextFunction, Request as DefaultRequest, Response } from 'express';
import { User } from 'entities/User';

interface Request extends DefaultRequest {
  user: Partial<User>;
}

export { Request, Response, NextFunction };
