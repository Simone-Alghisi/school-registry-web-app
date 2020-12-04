import { Response, Request, NextFunction } from 'express';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../services/class.service'
import { CommonModel } from '../common/models/common.model'

/**
 * GradeMiddleware class, it extends the {@link ClassMiddleware} class.
 * It aims to manage all the requests received for the class resource:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class GradeMiddleware extends ClassMiddleware{

  constructor(){
    super();
  }

  /**
   * Asynchronous function which checks if the class id contained in the 
   * parameters of the request corresponds to a class stored in the database
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
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

  /**
   * Asynchronous function which checks if the student id contained in the 
   * body of the request corresponds to a student stored in the database
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
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

  /**
   * Function which validates the value contained in the request
   * A valid value should be an integer and should be between 0 and 10 (both the extremes included)
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateValue(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isNumber(req.body.value)  && parseInt(req.body.value) >= 0 && parseInt(req.body.value) <= 10) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Function which validates the date contained in the request
   * A valid date should have the common format and it should be a string
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateDate(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isValidStringDate(req.body.date)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Function which validates the subject contained in the request
   * A valid subject should be an integer
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateSubject(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && CommonModel.isNumber(req.body.subject)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Function which validates the description of a grade
   * A valid description should be a string 
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
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
  
  discardUselessFields(req: Request, res: Response, next: NextFunction){
    let set = {};
    try{
      const properties: string[] = ['date', 'description', 'value'];
      for(const key of Object.keys(req.body)){
        if(!(properties.indexOf(key) === -1)){
          set['grades_list.$.' + key] = req.body[key];
        }
        delete req.body[key];
      }
      req.body['$set'] = set;
      next();
    }catch(e){
      res.status(500).send({error: 'Internal server error'});
    }
  }
  
}