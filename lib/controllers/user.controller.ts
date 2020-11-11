import { Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crud.interface'
import users from '../db/db'
import { User } from '../models/user.model';

/**
 * UserController class, it implements the {@link CRUDController} interface.
 * It aims to manage all the operations that involves the user resource
 */
export class UserController implements CRUDController{
  constructor() {}

  /**
   * Asyncronous functions that retrieves the list of users from the "DB"
   * and sends it back with the status code 200
   * @param req express Request object
   * @param res express Response object
   */
  async list(req: Request, res: Response): Promise<void>{
    res.status(200).send(users);
  }

  /**
   * Asyncronous functions that inserts the new user in the "DB", sends back
   * the location of the new element with the status code 201
   * @param req express Request object
   * @param res express Response object
   */
  async create(req: Request, res: Response): Promise<void> {
    let id = Math.max(...users.map(function(u) { return u.id; })) + 1;
    if(!Number.isFinite(id)){
      id = 0;
    }
    const user:User = new User(req.body.name, req.body.surname, req.body.email, req.body.password, id, req.body.role, req.body.birth_date);
    users.push(user);
    res.status(201).location('api/v1/users/'+id).send();
  }
  
  /**
   * Asyncronous functions which is not allowed, it sends back error code 405
   * @param req express Request object
   * @param res express Response object
   */
  async updateAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }
  
  /**
   * Asyncronous functions that retrieves a user with a specific id from the "DB",
   * sends back the requested user with the status code 200
   * @param req express Request object
   * @param res express Response object
   */
  async getById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    res.status(200).send(users.find(user => user.id === userId));
  }

  /**
   * Asyncronous functions that updates a user with a specific id in the "DB"
   * sends back the updated user with the status code 200
   * @param req express Request object
   * @param res express Response object
   */
  async updateById(req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id, 10);
    const updatedUser: any = users.find(user => user.id === userId);
    for(const i in req.body){
      updatedUser[i] = req.body[i];
    }
    users.map(user => user.id === userId || updatedUser);
    res.status(200).send(updatedUser);
  }

  /**
   * Asyncronous functions which is not allowed, it sends back error code 405
   * @param req express Request object
   * @param res express Response object
   */
  async deleteAll(req: Request, res: Response): Promise<void> {
    res.status(405).json({ error: 'Method not allowed' });
  }

  /**
   * Asyncronous functions that deletes a user with a specific id in the "DB"
   * sends back the status code 204
   * @param req express Request object
   * @param res express Response object
   */
  async deleteById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    users.splice(id,1);
    res.status(204).send();
  }  
}