import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crud.interface'
import users from '../db/db'
import { User } from '../models/user.model';
import { CommonController } from '../common/controllers/common.controller';

/**
 * UserController class, it extends the {@link CommonController} class and implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the user resource
 */
export class UserController extends CommonController implements CRUDController{
  constructor() {
    super();
  }

  async list(req: Request, res: Response): Promise<void>{
    res.status(200).send(users);
  }

  async create(req: Request, res: Response): Promise<void> {
    let id = Math.max(...users.map(function(u) { return u.id; })) + 1;
    if(!Number.isFinite(id)){
      id = 0;
    }
    const user:User = new User(req.body.name, req.body.surname, req.body.email, req.body.password, id, req.body.role, req.body.birth_date);
    users.push(user);
    res.status(201).location('api/v1/users/'+id).send();
  }
  
  async updateAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }
  
  async getById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    res.status(200).send(users.find(user => user.id === userId));
  }

  async updateById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    const updatedUser: any = users.find(user => user.id === userId);
    for(const i in req.body){
      updatedUser[i] = req.body[i];
    }
    users.map(user => user.id === userId || updatedUser);
    res.status(200).send(updatedUser);
  }

  async deleteAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    users.splice(id,1);
    res.status(204).send();
  }  
}