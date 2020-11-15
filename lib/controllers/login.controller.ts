import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export class LoginController {
  private static tokenExpiration = '1h';

  constructor() {}

  //TODO add refresh token
  async createJWT(req: Request, res: Response) {
    dotenv.config();
    const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
    console.log('CREATE JWT');
    try{
      const token = jwt.sign({ email: req.body.email, role: req.body.role }, jwtSecret, {expiresIn: LoginController.tokenExpiration});
      res.status(200).json({ message: 'Login successful', accessToken: token, refreshToken: ''});
    }catch (err) {
      console.log('FAILED CREATE JWT' + err);
      res.status(500).json({error: 'Internal server error'});
    }
  }
}