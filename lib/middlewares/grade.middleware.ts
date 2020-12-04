import { Response, Request, NextFunction } from 'express';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../services/class.service'
import { CommonModel } from '../common/models/common.model'
import { GradeService } from '../services/grade.service';

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
   * Method that checks if it exists a class that has the same class id 
   * contained in the parameters of the request
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateClassExists(req: Request, res: Response, next: NextFunction): Promise<void>{
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
      res.status(404).json({error: 'Grade or class not found'});
    }
  }

  /**
   * Method that checks if it exists a grade that has the same class id 
   * contained in the parameters of the request
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateGradeExists(req: Request, res: Response, next: NextFunction): Promise<void>{
    const gradeService = GradeService.getInstance();
    const classModel = ClassModel.getInstance();
    let success = false;
    if(classModel.isValidId(req.params.id)){
        if(classModel.isValidId(req.params.idg)){
        const geadeElem = await gradeService.getById(req.params.id, req.params.idg);
        if (geadeElem) {
          success = true;
        }
      }
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'Grade or class not found'});
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
   * Function which validates the type of the value contained in the request
   * A valid value should be an integer and should be between 0 and 10 (both the extremes included)
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateValueType(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && (req.body.value || req.body.value === "")) {
      if(CommonModel.isNumber(req.body.value) && parseInt(req.body.value) >= 0 && parseInt(req.body.value) <= 10) {
        next();
      } else {
        res.status(204).json({ error: 'No content'});
      }
    } else {
      next();
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
   * Function which validates the type of date filed contained in the request
   * A valid date should have the common format and it should be a string
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateDateType(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && (req.body.date || req.body.date === "")) {
      if (CommonModel.isValidStringDate(req.body.date)) {
        next();
      } else {
        res.status(204).json({ error: 'No content' });
      }
    } else {
      next();
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
   * Function which validates the type of the description field of a grade
   * A valid description should be a string 
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateDescriptionType(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && (req.body.description || req.body.description === "")) {
      if (req.body && CommonModel.validateString(req.body.description)) {
        next();
      } else {
        res.status(204).json({ error: 'No content' });
      }
    } else {
      next();
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
  
  /**
   * Removes fields different from date, description and value 
   * @param req Request object
   * @param res Response object
   * @param next Next function
   */
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
      if(!(Object.keys(set).length === 0)){
        req.body['$set'] = set;
      }
      next();
    }catch(e){
      res.status(500).send({error: 'Internal server error'});
    }
  }
  
}