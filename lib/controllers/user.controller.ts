import { Application, Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crud.interface'
import users from '../db/db'
import { User } from '../models/user.model';
import { CommonController } from '../common/controllers/common.controller';

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
    console.log(id);
    if(req.body == null || req.body == undefined || this.checkValidity(req.body.name, "string") ||
    this.checkValidity(req.body.surname, "string") || this.checkValidity(req.body.email, "string") ||
    this.checkValidity(req.body.password, "string") || this.checkValidity(req.body.name, "number") || 
    req.body.role < 0 || req.body.role > 2 || this.checkValidity(req.body.birth_date, "string")){
      res.status(422).send();
    } else {
      const user:User = new User(req.body.name, req.body.surname, req.body.email, req.body.password, id, req.body.role, req.body.birth_date);
      users.push(user);
      res.status(201).location('api/v1/users/'+id).send();
    }
    
  }
  async updateById(req: Request, res: Response): Promise<void> {}
  async getById(req: Request, res: Response): Promise<void> {}
  async deleteById(req: Request, res: Response): Promise<void> {}
}