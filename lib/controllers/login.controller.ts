import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

/**
 * LoginController class
 * It aims to manage all the operations that involves the generation of JWT
 */
export class LoginController {
  /**
   * Token expiration value
   */
  private static tokenExpiration = '1m';
  /**
   * Refresh token expiration value
   */
  private static refreshTokenExpiration = '2h';

  constructor() {}

  /**
   * Asyncronous functions that creates the JWT access token which will be included as a bearer token in each api request that
   * needs certain level of protection
   * It will generate also a refreshToken which will be used to obtain a fresh new access token
   * @param req request
   * @param res response
   */
  async createJWT(req: Request, res: Response) {
    dotenv.config();
    const jwtSecret = process.env.JWT_SECRET || '';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || '';
    try{
      const token = jwt.sign({ _id: req.body._id, email: req.body.email, role: req.body.role }, jwtSecret, {expiresIn: LoginController.tokenExpiration});
      const refToken = jwt.sign({ _id: req.body._id, email: req.body.email, role: req.body.role }, jwtRefreshSecret, {expiresIn: LoginController.refreshTokenExpiration});

      res.status(200).json({ message: 'Login successful', accessToken: token, refreshToken: refToken});
    }catch (err) {
      console.log('FAILED CREATE JWT' + err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Asyncronous functions that generates a new accessToken
   * It is used when it is required to generate a new access token given a refresh token 
   * @param req request
   * @param res response
   */
  async refreshJWT(req: Request, res: Response) {
    dotenv.config();
    const jwtSecret = process.env.JWT_SECRET || '';
    try{
      const token = jwt.sign({ _id: req.jwt._id, email: req.jwt.email, role: req.jwt.role }, jwtSecret, {expiresIn: LoginController.tokenExpiration});
      
      res.status(200).json({ message: 'Refresh successful', accessToken: token});
    }catch (err) {
      console.log('FAILED REFRESH JWT' + err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}