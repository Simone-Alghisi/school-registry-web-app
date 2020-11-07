import { Application, Request, Response } from 'express';
import { CRUDController } from '../common/interfaces/crud.interface'
import users from '../db/db'

export class UserController implements CRUDController{
  constructor() {
  }

  async list(req: Request, res: Response): Promise<void>{
    res.status(200).send(users);
  }

  async create(req: Request, res: Response): Promise<void> {}
  async updateById(req: Request, res: Response): Promise<void> {}
  async getById(req: Request, res: Response): Promise<void> {}
  async deleteById(req: Request, res: Response): Promise<void> {}
}