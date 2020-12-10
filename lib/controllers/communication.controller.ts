import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crudController.interface'
import { CommunicationService } from '../services/communication.service';

/**
 * CommunicationController class, it implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the communication resource
 */
export class CommunicationController implements CRUDController {
  constructor() {}

  /**
   * Asyncronous functions that get a list of communication based on
   * a list of parameters passed in the request
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async list(req: Request, res: Response): Promise<void>{
    const classService = CommunicationService.getInstance();
    let communications: any;
    try{
      if(req.query && Object.keys(req.query).length !== 0){
        communications = await classService.filterList(req.query);
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
      res.status(200).send(communications);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Asyncronous functions which creates the communication inside the specified user resource 
   * and sends the status code 200 in case of success, 500 otherwise
   * @param req express Request object
   * @param res express Response object
   */
  async create(req: Request, res: Response): Promise<void> {
    const communicationService = CommunicationService.getInstance();
    try{
      req.body.user_id = req.params.id;
      const communicationId = await communicationService.create(req.body);
      res.status(201).location('api/v1/users/' + req.params.id + '/communications/'+ communicationId).send();
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Asyncronous functions which is not allowed, it sends back error code 405
   * @param req express Request object
   * @param res express Response object
   */
  async updateAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }
  
  /**
   * Asyncronous functions that retrives a communication sended 
   * to a user given the userId and the resourceId
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async getById(req: Request, res: Response): Promise<void> {
    const communicationService = CommunicationService.getInstance();
    try{
      let foundCommunications;
      foundCommunications = await communicationService.getById(req.params.id,req.params.idc);
      res.status(200).send(foundCommunications);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

    /**
   * Asyncronous functions that retrives a communication 
   * given its resourceId
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async getSendedById(req: Request, res: Response): Promise<void> {
    const communicationService = CommunicationService.getInstance();
    try{
      let foundCommunications;
      foundCommunications = await communicationService.getSendedById(req.params.id);
      res.status(200).send(foundCommunications);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Asyncronous function that
   * and sends the code 200 in case of success, 500 otherwise
   * @param req express Request object
   * @param res express Response object
   */
  async updateById(req: Request, res: Response): Promise<void> {

  }

  /**
   * Asyncronous functions which is not allowed, it sends back error code 405
   * @param req express Request object
   * @param res express Response object
   */
  async deleteAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }

  /**
   * Asyncronous functions that
   * sends back the status code 204 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async deleteById(req: Request, res: Response): Promise<void> {

  }  
}