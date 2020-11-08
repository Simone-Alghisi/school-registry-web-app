import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crud.interface'
import users from '../db/db'
import { User } from '../models/user.model';
import { CommonController } from '../common/controllers/common.controller';
import moment from 'moment'

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

    const promise: Promise<any> = new Promise(function(resolve, reject) {
      if(req.body === null || req.body === undefined || !UserController.checkValidity(req.body.name, 'string') ||
      !UserController.checkValidity(req.body.surname, 'string') || !UserController.checkValidity(req.body.email, 'string') ||
      !UserController.checkValidity(req.body.password, 'string') || !UserController.checkValidity(req.body.role, 'number') || 
      req.body.role < 0 || req.body.role > 2 || !UserController.checkValidity(req.body.birth_date, 'string')){
        reject(new Error('Something Went Wrong'));
      } else {
        resolve('done');
      }
    });

    promise.then(
      function(){
        const user:User = new User(req.body.name, req.body.surname, req.body.email, req.body.password, id, req.body.role, req.body.birth_date);
        users.push(user);
        res.status(201).location('api/v1/users/'+id).send();
      },
      function(){
        res.status(422).json({ error: 'Unprocessable entity' });
      }
    )

  }
  
  async updateAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }
  
  async getById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    const promise: Promise<any> = new Promise(function(resolve, reject) {
      if(req.params === null || req.params === undefined || !UserController.checkValidity(userId, 'number') || !users.some(user => user.id == userId)){
        reject(new Error('Something Went Wrong'));
      } else {
        resolve('done');
      }
    });
    promise.then(
      function(){
        res.status(200).send(users.find(user => user.id === userId));
      },
      function(){
        res.status(404).json({ error: 'User not found' });
      }
    )
  }

  async updateById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    const promise = new Promise(function(resolve, reject) {
      if(req.params == null || req.params == undefined || !UserController.checkValidity(userId, 'number') || !users.some(user => user.id == userId)){
        reject(new Error('Something Went Wrong'));
      } else {
        resolve('done');
      }
    });
    promise.then(
      function(){
        if(req.body == null || req.body == undefined){
          res.status(204).send();
        } else {
          new Promise(function () {
            UserController.findAndUpdateUserById(req, res, userId);
          });
        }
      },
      function(){
        res.status(404).json({ error: 'Id not found or invalid' });
      }
    )
  }

  /**
   * Check if a string is compliant with the ISO 8601 standard
   * @param date a date as a string
   * @returns true if it's compliant
   * @returns false if it is not
   */
  static isDate(date: string): boolean{
    return moment(date, moment.ISO_8601, true).isValid();
  }

  /**
   * Function which find a user given a specific id and update it 
   * if the parameters are corrects
   * 200 HTTP code if all went good and returns the updated user
   * 204 HTTP code in case there's no need to update the resource
   * @param req request
   * @param res response
   * @param userId id of the specific user
   */
  static findAndUpdateUserById(req: Request, res: Response, userId: number) :void{
    const userToUpdate: any = users.find(user => user.id === userId);
    const name: string = req.body.name;
    const surname: string = req.body.surname;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const role: number = req.body.role;
    const birth_date: string = req.body.birth_date;
    let modified = false;

    if(UserController.checkValidity(name, 'string')){
      userToUpdate.name = name;
      modified = true;
    }

    if(UserController.checkValidity(surname, 'string')){
      userToUpdate.surname = surname;
      modified = true;
    }

    if(UserController.checkValidity(email, 'string')){
      userToUpdate.email = email;
      modified = true;
    }

    if(UserController.checkValidity(password, 'string')){
      userToUpdate.password = password;
      modified = true;
    }

    if(UserController.checkValidity(role, 'number') && role >= 0 && role <= 2){
      userToUpdate.role = role;
      modified = true;
    }

    if(UserController.checkValidity(birth_date, 'string') && this.isDate(birth_date)){
      modified = true;
    }

    if(!modified){
      res.status(204).send();
    } else {
      users.map(user => user.id === userId || userToUpdate);
      res.status(200).send(userToUpdate);
    }
  }

  async deleteAll(req: Request, res: Response): Promise<void> {}
  async deleteById(req: Request, res: Response): Promise<void> {}  
}