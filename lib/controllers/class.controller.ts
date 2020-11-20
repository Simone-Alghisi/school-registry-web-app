import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crudController.interface'
import { ClassService } from '../services/class.service';

/**
 * ClassController class, it implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the class resource
 */
export class ClassController implements CRUDController{
  constructor() {}

  /**
   * Asyncronous functions that retrieves the list of classes from the DB
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async list(req: Request, res: Response): Promise<void>{
		const classService = ClassService.getInstance();
    try{
      const users = await classService.list();
      res.status(200).send(users);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Asyncronous functions that insert a class in the DB
   * and sends the status code 200 in case of success, 500 otherwise
   * @param req express Request object
   * @param res express Response object
   */
  async create(req: Request, res: Response): Promise<void> {
    const classService = ClassService.getInstance();
    try{
      const classId = classService.create(req.body);
      res.status(201).location('api/v1/classes/' + classId).send();
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async updateAll(req: Request, res: Response): Promise<void> {}
  
  async getById(req: Request, res: Response): Promise<void> {}

  async updateById(req: Request, res: Response): Promise<void> {}

  async deleteAll(req: Request, res: Response): Promise<void> {}

  async deleteById(req: Request, res: Response): Promise<void> {}  
}