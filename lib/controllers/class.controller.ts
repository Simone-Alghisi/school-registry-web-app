import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crudController.interface'
import { ClassService } from '../services/class.service';


export class ClassController implements CRUDController{
  constructor() {}

  async list(req: Request, res: Response): Promise<void>{
		const classService = ClassService.getInstance();
    try{
      const users = await classService.list();
      res.status(200).send(users);
    }catch(e){
      res.status(500).json({error: 'Internal server error'});
    }
  }

  async create(req: Request, res: Response): Promise<void> {}

  async updateAll(req: Request, res: Response): Promise<void> {}
  
  async getById(req: Request, res: Response): Promise<void> {}

  async updateById(req: Request, res: Response): Promise<void> {}

  async deleteAll(req: Request, res: Response): Promise<void> {}

  async deleteById(req: Request, res: Response): Promise<void> {}  
}