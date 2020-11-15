import { Response, Request, NextFunction } from 'express';

/**
 * CommonMiddleware class
 * It implements some useful method that can check the validity, the type or parse the data passed
 */
export class CommonMiddleware {  
  constructor() {}

  onlySecretaryNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.body.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 2) {
        next();
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (e) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }

  onlyProfessorNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.body.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 1) {
        next();
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (e) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }

  onlyStudentNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.body.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 0) {
        next();
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (e) {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
}