import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crudController.interface'
import { CommonModel } from '../common/models/common.model';
import { GradeService } from '../services/grade.service';

/**
 * GradeController class, it implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the grades resource
 */
export class GradeController implements CRUDController{
  constructor() {}

  /**
   * Asyncronous functions that retrieves the list of grades of a class
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async list(req: Request, res: Response): Promise<void>{
    const gradeService = GradeService.getInstance();
    try{
      let foundGrades;
      if(req.query && Object.keys(req.query).length !== 0){
        foundGrades = await gradeService.filterList(req.params.id, req.query);
      } else {
        foundGrades = await gradeService.list(req.params.id);
      }
      res.status(200).send(foundGrades);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  /**
   * Asyncronous functions that creates a grade associated to the student and the class where 
   * he or she belongs given the proper parameters.
   * It returns 201 status code with the grade resource location if the database is able to
   * insert the value
   * It returns 500 if the database fails in inserting the new record.
   * 
   * @param req express Request object
   * @param res express Response object
   */
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
    res.status(405).json({ error: 'Method not allowed' });
  }
  
  /**
   * Asyncronous functions that retrieves a specific grade of a class
   * and sends it back with the status code 200 otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async getById(req: Request, res: Response): Promise<void> {
    const gradeService = GradeService.getInstance();
    try{
      let foundGrades;
      foundGrades = await gradeService.getById(req.params.id,req.params.idg);
      res.status(200).send(foundGrades);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async updateById(req: Request, res: Response): Promise<void> {
    const gradeService = GradeService.getInstance();
    try{
      req.body.class_id = req.params.id;
      req.body.grade_id = req.params.idg;
      console.log(req.body);
      const updatedGrade = await gradeService.updateById(req.body);
      res.status(200).send(updatedGrade);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async deleteAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }

  /**
   * Asyncronous functions that deletes a specific grade of a class
   * and sends the status code 204 id succesful otherwise 500
   * @param req express Request object
   * @param res express Response object
   */
  async deleteById(req: Request, res: Response): Promise<void> {
    const gradeService = GradeService.getInstance();
    try{
      await gradeService.deleteById(req.params);
      res.status(204).send();
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }  
}