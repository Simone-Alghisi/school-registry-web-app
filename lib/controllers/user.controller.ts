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
    //Promise Call
    let promise = new Promise(function(resolve, reject) {
      if(req.body == null || req.body == undefined || !UserController.checkValidity(req.body.name, "string") ||
      !UserController.checkValidity(req.body.surname, "string") || !UserController.checkValidity(req.body.email, "string") ||
      !UserController.checkValidity(req.body.password, "string") || !UserController.checkValidity(req.body.role, "number") || 
      req.body.role < 0 || req.body.role > 2 || !UserController.checkValidity(req.body.birth_date, "string")){
        reject(new Error("Something Went Wrong"));
      } else {
        resolve("done");
      }
    });

    //checking the result of the promise
    promise.then(
      function(result){
        const user:User = new User(req.body.name, req.body.surname, req.body.email, req.body.password, id, req.body.role, req.body.birth_date);
        users.push(user);
        res.status(201).location('api/v1/users/'+id).send();
      },
      function(error){
        res.status(422).send();
      }
    )

  }
  async updateById(req: Request, res: Response): Promise<void> {}
  async getById(req: Request, res: Response): Promise<void> {}
  async deleteById(req: Request, res: Response): Promise<void> {}  
}