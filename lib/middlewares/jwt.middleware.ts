import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export class JwtMiddleware {

  constructor(){}

  validateJWT(req: Request, res: Response, next: NextFunction) {
    dotenv.config();
    const jwtSecret:string = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
    if (req.headers['authorization']) {
      try{
        const authorization = req.headers.authorization.split(' ');
        //Basic HTTP Authentication convention
        if(authorization[0] !== 'Bearer'){
          console.log('Missing Bearer');
          res.status(401).json({ message: 'Authentication failed' });
        } else{
          const token = authorization[1];
          const decoded = jwt.verify(token, jwtSecret);
          req.body.role = decoded['role'];
          next();
        }
      } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      console.log('Missing header');
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
}