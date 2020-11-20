import { Response, Request, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import * as crypto from 'crypto';

/**
 * JwtMiddleware class
 * It aims to manage all the login requests received:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class LoginMiddleware {

  constructor(){}

  /**
   * Function that checks if the request has the email and the password field
   * If not then the 401 unauthorized HTTP verb is sent
   * @param req request
   * @param res response
   * @param next next function
   */
  async validateLoginBody(req: Request, res: Response, next: NextFunction): Promise<any> {
    if(req.body && req.body.email && req.body.password){
      next();
    }else{
      res.status(401).send({error: 'Login failed'});
    }
  }

  /**
   * Function that will check if the given credentials match to those of an existing user
   * If yes then the nexfunction is called, otherwise the 401 unauthorize HTTP verb is sent
   * @param req request
   * @param res response
   * @param next next function
   */
  async verifyEmailAndPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    const userService = UserService.getInstance();
    const user: any = await userService.getByEmail(req.body.email);
    if (user) {
      const hashedPassword:string = user.password;
      const salt:string = user.salt;
      let insertedPassword:string = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
      insertedPassword = insertedPassword + salt;
      if(insertedPassword === hashedPassword){
        req.body.role = user.role;
        req.body._id = user.id;
        next();
      }else {
        res.status(401).json({errors: 'Login failed'});
      }
    } else {
      res.status(401).json({errors: 'Login failed'});
    }
  }
}