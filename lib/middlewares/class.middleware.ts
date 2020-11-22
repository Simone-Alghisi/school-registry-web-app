import { Response, Request, NextFunction } from 'express';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../services/class.service'
import { CommonMiddleware } from '../common/middlewares/common.middleware';

export class ClassMiddleware extends CommonMiddleware{
  /**
   * Function that validate a field of the {@link Class} class
   * @param req Express request
   * @param field field that needs to be validated
   * @param fieldName name of the field that needs to be validated
   * 
   * @returns true if the field is valid
   * @returns false otherwise
  */
  static validField(field: any, fieldName: string): boolean{
    try{
      const classModel = ClassModel.getInstance();
      const classSchema = new classModel.classCollection();
      classSchema[fieldName] = field;
      const error = classSchema.validateSync();
      if(error?.errors[fieldName]){
        return false;
      }else{
        return true;
      }
    }catch(e){
      return false;
    }
  }

  /**
   * Middleware that checks if the given name in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateName(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && ClassMiddleware.validField(req.body.name, 'name')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }
  
  async validateUserExists(req: Request, res: Response, next: NextFunction): Promise<void>{
    const classService = ClassService.getInstance();
    const classModel = ClassModel.getInstance();
    let success = false;
    if(classModel.isValidId(req.params.id)){
      const classElem = await classService.getById(req.params.id);
      if (classElem) {
        success = true;
      } 
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'Class not found'});
    }
  }

  discardUselessFields(req: Request, res: Response, next: NextFunction): void{
    const classModel = ClassModel.getInstance();
    try{
      const properties: string[] = Object.keys(classModel.classSchema.paths);
      for(const key of Object.keys(req.body)){
        if(properties.indexOf(key) === -1){
        delete req.body[key];
        }
      }
      next();
    }catch(e){
      res.status(500).send({error: 'Internal server error'});
    }
  }
  
  async validateClassExists(req: Request, res: Response, next: NextFunction): Promise<void>{
    const classService = ClassService.getInstance();
    const classModel = ClassModel.getInstance();
    let success = false;
    if(classModel.isValidId(req.params.id)){
      const user = await classService.getById(req.params.id);
      if (user) {
        success = true;
      } 
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'Class not found'});
    }
  }

  //TODO move it to /lib/middlewares/common.middleware.ts
  validateUpdateBody(req: Request, res: Response, next: NextFunction): void{
    if (req.body && Object.keys(req.body).length !== 0) {
      next();
    } else {
      res.status(204).send();
    }
  }
  
  async validateUpdateRequest(req: Request, res: Response, next: NextFunction): Promise<void>{
    const updatedClass = await ClassService.getInstance().getById(req.params.id);
    let valid = false;
    if(updatedClass){
      for(const i in req.body){
        if(ClassMiddleware.validField(req.body[i], '' + i)){
          valid = true;
        }else{
          delete req.body[i];
        }
      }
    }
    if(valid){
      next();
    } else {
      res.status(204).send();
    }
  }

  discardUselessFieldsQuery(req: Request, res: Response, next: NextFunction): void{
    const classModel = ClassModel.getInstance();
    try{
      const properties: string[] = Object.keys(classModel.classSchema.paths);
      for(const key of Object.keys(req.query)){
        if(properties.indexOf(key) === -1){
          delete req.query[key];
        }
      }
      next();
    }catch(e){
      res.status(500).send({error: 'Internal server error'});
    }
  }
}