import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

/**
 * JwtMiddleware class
 * It aims to manage all the requests received:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class JwtMiddleware {

  constructor(){}

  /**
   * Method that will validate a given jwt token
   * If it is valid the next function is called
   * If not the 403 forbidden HTTP verb is sent
   * @param req request
   * @param res response
   * @param next next function
   */
  validateJWT(req: Request, res: Response, next: NextFunction): void{
    dotenv.config();
    const jwtSecret:string = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
    if (req.headers['authorization']) {
      try{
        const authorization = req.headers.authorization.split(' ');
        //Basic HTTP Authentication convention
        if(authorization[0] !== 'Bearer'){
          console.log('Missing Bearer');
          res.status(403).json({ error: 'Forbidden' });
        } else{
          const token = authorization[1];
          const decoded = jwt.verify(token, jwtSecret);
          req.jwt =  { _id: decoded['_id'], email: decoded['email'], role: decoded['role'] };
          next();
        }
      } catch (error) {
        console.log(error);
        res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      console.log('Missing header');
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  /**
   * Method that will check if the refresh token field is present in the request
   * @param req request
   * @param res response
   * @param next next function
   */
  validateRefreshTokenField(req: Request, res: Response, next: NextFunction):void {
    if (req.body && req.body.refreshToken) {
      next();
    } else {
      res.status(401).send({error: 'Login failed'});
    }
  }

  /**
   * Method that will validate a refresh token request 
   * It checks if the refresh token is valid, otherwise it will send 401 unauthorized error
   * @param req 
   * @param res 
   * @param next 
   */
  validateRefreshTokenContent(req: Request, res: Response, next: NextFunction):void {
    dotenv.config();
    const jwtRefreshSecret:string = process.env.JWT_REFRESH_SECRET ? process.env.JWT_REFRESH_SECRET : '';
    try{
      const decoded = jwt.verify(req.body.refreshToken, jwtRefreshSecret);
      req.jwt = { _id: decoded['_id'], role: decoded['role'], email: decoded['email'] };
      next();
    }catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Login failed'});
    }
  }
}