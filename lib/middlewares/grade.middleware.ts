import { Response, Request, NextFunction } from 'express';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import { CommonModel } from '../common/models/common.model'

export class GradeMiddleware extends ClassMiddleware{

  constructor(){
    super();
  }

  async validateStudent(req: Request, res: Response, next: NextFunction) : Promise<void>{
    console.log('Sono qui: user');
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
    console.log('Sono qui: value');
    if (req.body && CommonModel.isNumber(req.body.value)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateDate(req: Request, res: Response, next: NextFunction) :void{
    console.log('Sono qui: date');
    if (req.body && CommonModel.isValidStringDate(req.body.date)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateSubject(req: Request, res: Response, next: NextFunction) :void{
    console.log('Sono qui: subject');
    if (req.body && CommonModel.isNumber(req.body.subject)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  validateDescription(req: Request, res: Response, next: NextFunction) :void{
    console.log('Sono qui: description');
    if (req.body && CommonModel.validateString(req.body.description)) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }
}