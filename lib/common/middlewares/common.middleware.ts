import { Response, Request, NextFunction } from 'express';

/**
 * CommonMiddleware class
 * It implements some useful method that can check the validity, the type or parse the data passed
 */
export class CommonMiddleware {  
  constructor() {}

  onlySecretaryNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.jwt.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 2) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  onlyProfessorNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.jwt.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 1) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  onlyStudentNeedsToDoThis(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = parseInt(req.jwt.role, 10);
      console.log('userRole: ' + userRole)
      if (userRole && userRole === 0) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }
}