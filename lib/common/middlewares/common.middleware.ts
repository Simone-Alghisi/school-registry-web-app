import { Response, Request, NextFunction } from 'express';

/**
 * CommonMiddleware class
 * It implements some useful method that can check the validity, the type or parse the data passed
 */
export class CommonMiddleware {  
  constructor() {}

  /**
   * Middleware that checks if the user is a secretary. If he is then the next function is called
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  onlySecretaryNeedsToDoThis(req: Request, res: Response, next: NextFunction): void{
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

  /**
   * Middleware that checks if the user is a professor. If he is then the next function is called
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  onlyProfessorNeedsToDoThis(req: Request, res: Response, next: NextFunction): void{
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

  /**
   * Middleware that checks if the user is a student. If he is then the next function is called
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  onlyStudentNeedsToDoThis(req: Request, res: Response, next: NextFunction): void{
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