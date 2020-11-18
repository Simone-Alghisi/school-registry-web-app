import { Response, Request, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import * as crypto from 'crypto';

export class LoginMiddleware {

  constructor(){}

  async validateLoginBody(req: Request, res: Response, next: NextFunction) {
    console.log('validateLoginBody');
    if(req.body && req.body.email && req.body.password){
      next();
    }else{
      res.status(401).send({error: 'Login failed'});
    }
  }

  async verifyEmailAndPassword(req: Request, res: Response, next: NextFunction) {
    const userService = UserService.getInstance();
    const user: any = await userService.getByEmail(req.body.email);
    console.log('verifyEmailAndPassword');
    if (user) {
      const hashedPassword:string = user.password;
      const salt:string = user.salt;
      let insertedPassword:string = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
      insertedPassword = insertedPassword + salt;
      if(insertedPassword === hashedPassword){
        console.log('equal things entered');
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
