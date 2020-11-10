import users from '../db/db'
import { Response, Request, NextFunction } from 'express';
import moment from 'moment'
import faker from 'faker';
import { User } from '../models/user.model';

/**
 * UserMiddleware class
 * It aims to manage all the requests received:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class UserMiddleware {
  
  constructor(){}

  /**
   * Function that returns the type of a fieldName in the User class
   * 
   * @param fieldName name of the field
   * @returns type::string of the field
   */
  static typeOfField(fieldName: string):string {
    const user:User = new User(faker.name.findName(), faker.name.findName(), faker.internet.email(), faker.internet.password(), 0, 0, faker.date.past().toLocaleDateString());
    const type:string = typeof user[fieldName];
    return type;
  }

  /**
   * Function that cast a string value into an integer
   * @param value string value
   * @returns value as a number if possibile
   */
  static stringToNumberCaster(value: string): any{
    if(value === ''){
      return value;
    } else {
      const parsed: number = parseFloat(value);
      return !isNaN(parsed) ? parsed : value;
    }
  }

  /**
   * Function that checks the validity of a field
   * In particular it checks if the field is not empty and if it is of the given type
   * @param value value of the field that needs to be checked
   * @param type type that the field should have 
   * @returns true if the field is valid
   * @returns false if the field is invalid
   */
  static checkValidity(value: any, type: string): boolean {
    let isValid = false;
    if(value != null && value !== '' && typeof value === type){
      isValid = true;
    }
    return isValid;
  }

  /**
   * Function that checks if a string is a valid date.
   * If it has the date format: YYYY-MM-DD
   * @param date string value of a date
   * 
   * @returns true if the date is valid
   * @returns false otherwise
   */
  static isDate(date: string): boolean{
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }

  /**
   * Function that validate a field of the {@link User} class
   * @param req Express request
   * @param field field that needs to be validated
   * @param fieldName name of the field that needs to be validated
   * 
   * @returns true if the field is valid
   * @returns false otherwise
   */
  static validField(req: Request, field: any, fieldName: string): boolean{
    const type: string = UserMiddleware.typeOfField(fieldName);
    let valid = true;
    if(type){
      if(fieldName === 'birth_date'){
        valid = UserMiddleware.isDate(field);
      } else if (type === 'number'){
        field = UserMiddleware.stringToNumberCaster(field);
        req.body[fieldName] = field;
      }
      if(fieldName === 'role'){
        valid = valid && field <= 2 && field >= 0;
      }
      valid = valid && UserMiddleware.checkValidity(field, type);
    }else{
      valid = false;
    }
    return valid;
  }

  /**
   * Middleware that checks if a given id in the params object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateIdParams(req: Request, res: Response, next: NextFunction) :void{
    const userId:number = parseInt(req.params.id, 10);
    const searchId:any = users.findIndex((user) => { return user.id === userId; })
    if (req.body && UserMiddleware.validField(req, userId, 'id') && searchId !== -1) {
      next();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }

  /**
   * Middleware that checks if the body of the request is empy for an update operation
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateUpdateBody(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && Object.keys(req.body).length !== 0) {
      next();
    } else {
      res.status(204).send();
    }
  }

  /**
   * Middleware that checks if an update is needed
   * If a field does not belog to the {@link User} class it is discarded
   * If no changed are needed the body is interpreted as an empty one, so the 204 HTTP code is returned
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateUpdateRequest(req: Request, res: Response, next: NextFunction) :void{
    const user: any = users.find(user => user.id === parseInt(req.params.id, 10));
    let valid = false;
    if(user){
      for(const i in req.body){
        if(i != 'id' && user.hasOwnProperty(i) && UserMiddleware.validField(req, req.body[i], '' + i)){
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

  /**
   * Middleware that checks if the given name in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateName(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, req.body.name, 'name')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given surname in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateSurname(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, req.body.surname, 'surname')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given email in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateEmail(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, req.body.email, 'email')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given password in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validatePassword(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, req.body.password, 'password')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given tole in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateRole(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, parseInt(req.body.role, 10), 'role')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given birth_date in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  validateBirthDate(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req, req.body.birth_date, 'birth_date')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }
}