import { Response, Request, NextFunction } from 'express';
import { ClassModel } from '../models/class.model';
import { ClassService } from '../services/class.service'

export class ClassMiddleware {
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
}