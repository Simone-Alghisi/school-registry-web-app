import { Response, Request, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { CommunicationService } from '../services/communication.service';
import { UserMiddleware } from './user.middleware';

/**
 * CommunicationMiddleware class, it extends the {@link UserMiddleware} class.
 * It aims to manage all the requests received for the communication resource:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class CommunicationMiddleware extends UserMiddleware{
  
  /**
   * Method that checks if it exists a communication inside the profile of a
   * specified user (data needed are retrieved from the request parameters)
   * Otherwise the 404 Not Found HTTP code is returned
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateCommunicationExists(req: Request, res: Response, next: NextFunction): Promise<void>{
    const communicationService = CommunicationService.getInstance();
    const userModel = UserModel.getInstance();
    let success = false;
    if(userModel.isValidId(req.params.id)){
        if(userModel.isValidId(req.params.idc)){
        const communicationList = await communicationService.getById(req.params.id, req.params.idc);
        if (communicationList) {
          success = true;
        }
      }
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'Communication or user not found'});
    }
  }

  /**
   * Method that checks if it exists a communication in the DB with the same
   * id passed in the request as a parameter
   * Otherwise the 404 Not Found HTTP code is returned
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateCommunicationExistsWithoutUser(req: Request, res: Response, next: NextFunction): Promise<void>{
    const communicationService = CommunicationService.getInstance();
    const userModel = UserModel.getInstance();
    let success = false;
    if(userModel.isValidId(req.params.id)){
      const communicationList = await communicationService.getSendedById(req.params.id);
      if (communicationList) {
        success = true;
      }
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'Communication or user not found'});
    }
  }

  /**
   * Middleware that checks the user id passed as query with the one 
   * inside the jwt token: a user can request only communications 
   * about himself or herself
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  requestMyCommunication(req: Request, res: Response, next: NextFunction): void{
    try {
      const id = req.jwt._id;
      if(id) {
        req.query._id = id;
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  /**
   * Middleware that checks if the user is a secretary
   * If that's the case, then the user can request all the communication sent
   * by all the secretaries in the system
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  requestMySendedCommunication(req: Request, res: Response, next: NextFunction): void{
    try {
      const id = req.jwt._id;
      const userRole = parseInt(req.jwt.role, 10);
      if(id && userRole === 2) {
        req.query.sender_role = '2';
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

  /**
   * Middleware that checks the user id in the parameters with the one 
   * inside the jwt token: a user can request only communications 
   * about himself or herself
   * Otherwise the 403 forbidden HTTP code is returned
   * @param req request
   * @param res response
   * @param next next function
   */
  requestOnlyMyCommunication(req: Request, res: Response, next: NextFunction): void{
    try {
      const id = req.jwt._id;
      const paramId = req.params.id;
      if(id === paramId) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (e) {
      res.status(403).json({ error: 'Forbidden' });
    }
  }

}