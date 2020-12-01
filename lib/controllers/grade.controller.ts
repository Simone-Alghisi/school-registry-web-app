import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crudController.interface'
import { GradeService } from '../services/grade.service';

/**
 * GradeController class, it implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the grades resource
 */
export class GradeController implements CRUDController{
  constructor() {}

  /**
   * Asyncronous functions that retrieves the list of grades of a class from the DB
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async list(req: Request, res: Response): Promise<void>{
    const gradeService = GradeService.getInstance();
    try{
      const foundGrades = await gradeService.list(req.params.id);
      res.status(200).send(foundGrades.grades_list);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const gradeService = GradeService.getInstance();
    try{
      req.body.class_id = req.params.id;
      const ids = await gradeService.create(req.body);
      res.status(201).location('api/v1/classes/' + ids[0] + '/grades/' + ids[1]).send();
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async updateAll(req: Request, res: Response): Promise<void> {
    
  }
  
  async getById(req: Request, res: Response): Promise<void> {

  }

  async updateById(req: Request, res: Response): Promise<void> {

  }

  async deleteAll(req: Request, res: Response): Promise<void> {

  }

  async deleteById(req: Request, res: Response): Promise<void> {

  }  
}