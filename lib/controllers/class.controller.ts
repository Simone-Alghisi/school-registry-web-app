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
    let classes: any;
    try{
      if(req.query && Object.keys(req.query).length !== 0){
        classes = await classService.filterList(req.params);
      }else{
        classes = await classService.list();
      }
      res.status(200).send(classes);
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
      const classId = await classService.create(req.body);
      res.status(201).location('api/v1/classes/' + classId).send();
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
  
  async getById(req: Request, res: Response): Promise<void> {
    const classService = ClassService.getInstance();
    try{
      const classFound = await classService.getById(req.params.id);
      res.status(200).send(classFound);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Sayncronous function that updates a class in the DB
   * and sends the code 200 in case of success, 500 otherwise
   * @param req express Request object
   * @param res express Response object
   */
  async updateById(req: Request, res: Response): Promise<void> {
    const classService = ClassService.getInstance();
    req.body.id = req.params.id;
    try{
      const updatedClass = await classService.updateById(req.body);
      res.status(200).send(updatedClass);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async deleteAll(req: Request, res: Response): Promise<void> {}

  async deleteById(req: Request, res: Response): Promise<void> {}  
}