import { Request, Response } from 'express';
import { YourselfService } from '../services/yourself.service';

/**
 * YourselfController class.
 * It aims to manage all the operations that involves the yourself resource
 */
export class YourselfController {
  constructor() {}

  /**
   * Asyncronous functions that retrieves the id, role and email of 
   * the user that calls it. 
   * Sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async get(req: Request, res: Response): Promise<void>{
    const yourselfService = YourselfService.getInstance();
    try{
      const yourself = await yourselfService.get(req.jwt._id, req.jwt.role);
      res.status(200).send(yourself);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }
}