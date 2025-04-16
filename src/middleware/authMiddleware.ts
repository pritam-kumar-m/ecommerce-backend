import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { TokenPayload } from '../modules/auth/types/auth.types';
import { auth } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      userData?: any;
    }
  }
}

// Create a wrapper function that ensures the auth middleware returns void
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  auth(req, res, () => {
    // After auth middleware runs, set req.user from req.userData
    if (req.userData) {
      req.user = {
        userId: req.userData.id,
        role: req.userData.role
      };
    }
    next();
  });
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}; 