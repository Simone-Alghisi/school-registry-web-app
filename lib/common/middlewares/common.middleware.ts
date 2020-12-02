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
      if (userRole && userRole === 0) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  /**
   * Middleware that checks if the user is a professor then he or she can request students
   * If he or she us a professor or a student can request only data about himself or herself
   * If he or she is a secretary, then he or she can request all the data about all the users in the system
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  requestMyStudentIfIamAProfessor(req: Request, res: Response, next: NextFunction): void{
    try {
      const email = req.jwt.email;
      const userRole = parseInt(req.jwt.role, 10);
      const usertRoleToGet = parseInt(req.query.role+'', 10);
      if(email && userRole === 1 && usertRoleToGet === 0) {
        next();
      } else if (email && userRole !== 2) {
        req.query.email = email;
        next();
      } else if(userRole && userRole === 2){
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

   /**
   * Middleware that checks if the body of the request is empy for an update operation
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateUpdateBody(req: Request, res: Response, next: NextFunction): void{
    if (req.body && Object.keys(req.body).length !== 0) {
      next();
    } else {
      res.status(204).send();
    }
  }
}