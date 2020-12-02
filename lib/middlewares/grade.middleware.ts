import { Response, Request, NextFunction } from 'express';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../services/class.service'
import { CommonModel } from '../common/models/common.model'

export class GradeMiddleware extends ClassMiddleware{

  constructor(){
    super();
  }

  async validateClassExistsInCreate(req: Request, res: Response, next: NextFunction): Promise<void>{
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
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  async validateStudent(req: Request, res: Response, next: NextFunction) : Promise<void>{
    const userService = UserService.getInstance();
    const userModel = UserModel.getInstance();
    let success = false;
    if(userModel.isValidId(req.body.student_id)){
      const user = await userService.getById(req.body.student_id);
      if (user && user.role === 0 && user.class_id == req.params.id) {
        success = true;
      } 
    }
    if(success){
      next();
    }else{
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateValue(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isNumber(req.body.value)  && parseInt(req.body.value) >= 0 && parseInt(req.body.value) <= 10) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateDate(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isValidStringDate(req.body.date)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateSubject(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isNumber(req.body.subject)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateDescription(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.validateString(req.body.description)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Removes fields which are not present in class.grades_list
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
  discardUselessFieldsQuery(req: Request, res: Response, next: NextFunction): void{
    const classModel = ClassModel.getInstance();
    try{
      const properties: string[] = Object.keys(classModel.classSchema.obj.grades_list[0]);
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