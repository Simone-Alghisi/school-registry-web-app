import { Response, Request, NextFunction } from 'express';
import { CommonMiddleware } from '../common/middlewares/common.middleware';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service'

/**
 * UserMiddleware class
 * It aims to manage all the requests received:
 * - In case of errors, the HTTP status code is returned
 * - Otherwise the request is allowed to pass
 */
export class UserMiddleware extends CommonMiddleware{
  /**
   * Function that validate a field of the {@link User} class
   * @param req Express request
   * @param field field that needs to be validated
   * @param fieldName name of the field that needs to be validated
   * 
   * @returns true if the field is valid
   * @returns false otherwise
  */
  static validField(field: any, fieldName: string): boolean{
    try{
      const userModel = UserModel.getInstance();
      const user = new userModel.userCollection();
      user[fieldName] = field;
      if(field !== '' && UserMiddleware.validateFieldRequired(fieldName)){
        const error = user.validateSync();
        if(error?.errors[fieldName]){
          return false;
        }
      }else if(field === '' && UserMiddleware.validateFieldRequired(fieldName)){
        return false;
      }
      return true;    
    }catch(e){
      return false;
    }
  }

  /**
   * Function that checks if a field is required given its name
   * @param fieldName 
   * 
   * @returns true if the field is required
   * @returns false if the field is not required
   */
  static validateFieldRequired(fieldName: string): boolean{
    const userModel = UserModel.getInstance();
    return userModel.userSchema.requiredPaths().indexOf(fieldName) > -1;
  }

  /**
   * Middleware that checks if a given id in the params object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateIdParams(req: Request, res: Response, next: NextFunction): Promise<void>{
    const userId:number = parseInt(req.params.id, 10);
    //const searchId:any = users.findIndex((user) => { return user.id === userId; }); //Questo dovrebbe essere findOne??
    const user = await UserService.getInstance().getById(req.params.userId);
    if (req.body && UserMiddleware.validField(userId, 'id') && user) {
      next();
    } else {
      res.status(404).json({ error: 'User not found' });
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
  async validateUpdateRequest(req: Request, res: Response, next: NextFunction): Promise<void>{
    const user = await UserService.getInstance().getById(req.params.id);
    let valid = false;
    if(user){
      for(const i in req.body){
        if(UserMiddleware.validField(req.body[i], '' + i)){
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
    if (req.body && UserMiddleware.validField(req.body.name, 'name')) {
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
    if (req.body && UserMiddleware.validField(req.body.surname, 'surname')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Middleware that checks if the given email in the body object of the request is valid
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunctionWW
   */
  validateEmail(req: Request, res: Response, next: NextFunction) :void{
    if (req.body && UserMiddleware.validField(req.body.email, 'email')) {
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
    if (req.body && UserMiddleware.validField(req.body.password, 'password')) {
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
    if (req.body && UserMiddleware.validField(parseInt(req.body.role, 10), 'role')) {
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
  validateBirthDate(req: Request, res: Response, next: NextFunction): void{
    if (req.body && UserMiddleware.validField(req.body.birth_date, 'birth_date')) {
      next();
    } else {
      res.status(422).json({ error: 'Unprocessable entity' });
    }
  }

  /**
   * Function which removes the salt parameter from the body
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  discardSaltField(req: Request, res: Response, next: NextFunction): void{
    if (req.body && req.body.salt) {
      delete req.body.salt;
    }
    next();
  }

  /**
   * Asynchronous function which checks if there is not another email
   * which is equal to the one specified in the request body
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateUniqueEmail(req: Request, res: Response, next: NextFunction): Promise<void>{
    const userService = UserService.getInstance();
    const user = await userService.getByEmail(req.body.email);
    if (user) {
      res.status(409).json({ error: 'Mail exists' });
    } else {
      next();
    }
  }

  /**
   * Asynchronous function which checks if there is a user
   * who has an id which is equal to the one specified in the request parameters
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  async validateUserExists(req: Request, res: Response, next: NextFunction): Promise<void>{
    const userService = UserService.getInstance();
    const userModel = UserModel.getInstance();
    let success = false;
    if(userModel.isValidId(req.params.id)){
      const user = await userService.getById(req.params.id);
      if (user) {
        success = true;
      } 
    }
    if(success){
      next();
    }else{
      res.status(404).json({error: 'User not found'});
    }
  }

  /**
   * Function which discards all the fields that are not contained in
   * the Schema of the User resource from the request body
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  discardUselessFields(req: Request, res: Response, next: NextFunction): void{
    const userModel = UserModel.getInstance();
    try{
      const properties: string[] = Object.keys(userModel.userSchema.paths);
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

  /**
   * Function which discards all the fields that are not contained in
   * the Schema of the User resource from the request query
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  discardUselessFieldsQuery(req: Request, res: Response, next: NextFunction): void{
    const userModel = UserModel.getInstance();
    try{
      const properties: string[] = Object.keys(userModel.userSchema.paths);
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
   * Function which discards passwords and salt from the request query
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  discardPasswordAndSaltQuery(req: Request, res: Response, next: NextFunction): void{
    if(req.query){
      delete req.query.password;
      delete req.query.salt;
    }
    next();
  }

  /**
   * Function which modifies the request body inserting the $set and $unset
   * values required by MongoDB in order to delete one or multiple fields.
   * 
   * @param req Express Request
   * @param res Express Response
   * @param next Express NextFunction
   */
  setUnsetField(req: Request, res: Response, next: NextFunction): void{
    const newBody = {$set: {}, $unset: {}};
    for(const field in req.body){
      if(req.body[field] === '' && !UserMiddleware.validateFieldRequired(field)){
        newBody.$unset[field] = 1;
      }else{
        newBody.$set[field] = req.body[field];
      }
    }
    req.body = newBody;
    next();
  }
}