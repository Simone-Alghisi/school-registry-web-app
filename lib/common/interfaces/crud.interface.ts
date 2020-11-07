import {Request, Response } from 'express';

export interface CRUDController {
  list: (req: Request, res: Response) => Promise<void>,
  create: (req: Request, res: Response) => Promise<void>,
  updateById: (req: Request, res: Response) => Promise<void>,
  getById: (req: Request, res: Response) => Promise<void>,
  deleteById: (req: Request, res: Response) => Promise<void>
}