import {Request, Response } from 'express';

/**
 * Interface that all Controllers have to implement.
 * It exposes all the CRUD functions
 */
export interface CRUDController {
  /**
   * Retrives (read) all instances of the resource
   */
  list: (req: Request, res: Response) => Promise<void>,
  /**
   * Creates a new instance of the resource
   */
  create: (req: Request, res: Response) => Promise<void>,
  /**
   * Update all the resources
   */
  updateAll: (req: Request, res: Response) => Promise<void>, 
  /**
   * Update all the resources
   */
  deleteAll: (req: Request, res: Response) => Promise<void>, 
  /**
   * Updates the instance of the resource with the given id
   */
  updateById: (req: Request, res: Response) => Promise<void>,
  /**
   * Retrives (read) the instance of the resource with the given id
   */
  getById: (req: Request, res: Response) => Promise<void>,
  /**
   * Deletes the instance of the resource with the given id
   */
  deleteById: (req: Request, res: Response) => Promise<void>
}