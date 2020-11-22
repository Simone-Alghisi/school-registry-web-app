import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { UserController } from  '../controllers/user.controller'
import { UserMiddleware } from '../middlewares/user.middleware'
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { CommonMiddleware } from '../common/middlewares/common.middleware';

/**
 * UserRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/users_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class UserRoutes extends CommonRoutes implements ConfigureRoutes {

  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'UserRoutes');
    this.configureRoutes();
  }

  /**
   * Configures the route for each HTTP method in the CRUD interfaces for user resources 
   */
  configureRoutes(): void {
    /** Instance of user controller that implements the logic of rest method*/
    const userController: UserController = new UserController();
    /** Instance of user middleware that checks every request on user resources*/
    const userMiddleware: UserMiddleware = new UserMiddleware();
    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();
    /** Instance of common middler that checks if a jwt token has the correct role*/
    const commonMiddleware: CommonMiddleware = new CommonMiddleware();

    /**
     * Route for the get method on the entire collection of users
     * The request is routed only to user controller function for get all (list)
    */
    this.app.get('/api/v1/users', [
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userMiddleware.discardUselessFieldsQuery,
      userMiddleware.discardPasswordAndSaltQuery,
      userController.list
    ]);

    /** 
     * Route for the get method on a single user with a specific id 
     * The request is routed through a middlewares that check the existance of the id to retrive
     * Then the request is routed to the appropriate user controller function for getById
    */
    this.app.get('/api/v1/users/:id', [
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userMiddleware.validateUserExists,
      userController.getById
    ]);

    /** 
     * Route for the post method (insert resource) on the users resources 
     * The request is routed through a series of middlewares that check the validitity of 
     * Name, surname, email password, role and birth_date
     * Then the request is routed to the appropriate user controller function for create
    */
    this.app.post('/api/v1/users', [
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userMiddleware.discardUselessFields,
      userMiddleware.validateName,
      userMiddleware.validateSurname,
      userMiddleware.validateEmail,
      userMiddleware.validateUniqueEmail,
      userMiddleware.validatePassword,
      userMiddleware.validateRole,
      userMiddleware.validateBirthDate,
      userController.create
    ]);

    /** 
     * Route for the patch method on the entire collection of users
     * The request is routed only to user controller function for updateAll
    */
    this.app.patch('/api/v1/users', [
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userController.updateAll
    ]);

    /**
     * Route for the patch method (update resource) on a single users 
     * The request is routed through a series of middlewares that check the existence of the id to update
     * The middlewares also check the validity of the body and of the request
     * Then the request is routed to the appropriate user controller function for UpdateById
    */
    this.app.patch('/api/v1/users/:id', [
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userMiddleware.discardUselessFields,
      userMiddleware.validateUserExists,
      userMiddleware.validateUpdateBody,
      userMiddleware.validateUpdateRequest,
      userMiddleware.discardSaltField,
      userMiddleware.setUnsetField,
      userController.updateById
    ]);

    /**
     * Route for the delete method on a single users 
     * The request is routed through a middleware that check the existence of the id to delete
     * Then the request is routed to the appropriate user controller function for deleteById
    */
    this.app.delete('/api/v1/users/:id',[
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userMiddleware.validateUserExists,
      userController.deleteById
    ]);

    /** Define the route for the delete method on the entire collection of users
     * The request is routed only to user controller function for deleteAll
    */
    this.app.delete('/api/v1/users',[
      jwtMiddleware.validateJWT,
      commonMiddleware.onlySecretaryNeedsToDoThis,
      userController.deleteAll
    ]);
  }
}