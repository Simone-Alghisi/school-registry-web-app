import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { ClassController } from '../controllers/class.controller';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { JwtMiddleware } from '../middlewares/jwt.middleware';

/**
 * ClassRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/classes_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class ClassRoutes extends CommonRoutes implements ConfigureRoutes {

  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'ClassRoutes');
    this.configureRoutes();
  }

  /**
   * Configures the route for each HTTP method in the CRUD interfaces for classes resources 
   */
  configureRoutes(): void {
    /** Instance of class controller that implements the logic of rest method*/
    const classController: ClassController = new ClassController();
    /** Instance of class middleware that checks every request on class resources*/
    const classMiddleware: ClassMiddleware = new ClassMiddleware();
    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    /**
     * Route for the get method on the entire collection of classes
     * The request is routed only to class controller function for get all (list)
    */
    this.app.get('/api/v1/classes', [
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classMiddleware.discardUselessFieldsQuery,
      classController.list
    ]);

    this.app.get('/api/v1/classes/:id', [
      jwtMiddleware.validateJWT,
      classMiddleware.onlyProfessorAndSecretaryNeedToDoThis,
      classMiddleware.validateClassExists,
      classController.getById
    ]);

    /** 
     * Route for the post method (insert resource) on the classes resources 
     * The request is routed through a  middlewares that check the validitity of name
     * The middlewares check also the validity of token and the role of the user
     * Then the request is routed to the appropriate class controller function for create
    */
    this.app.post('/api/v1/classes', [
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classMiddleware.validateName,
      classController.create
    ]);

    /** 
     * Route for the patch method on the entire collection of classes
     * The middlewares check the validity of token and the role of the user
     * The request is routed only to class controller function for updateAll
    */
    this.app.patch('/api/v1/classes', [
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classController.updateAll
    ]);

    /**
     * Route for the patch method (update resource) on a single class 
     * The request is routed through a series of middlewares that check the existence of the id to update
     * The middlewares also check the validity of the body and of the request
     * The middlewares check the validity of token and the role of the user
     * Then the request is routed to the appropriate class controller function for UpdateById
    */
    this.app.patch('/api/v1/classes/:id', [
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classMiddleware.discardUselessFields,
      classMiddleware.validateClassExists,
      classMiddleware.validateUpdateBody,
      classMiddleware.validateUpdateRequest,
      classController.updateById
    ]);

    /**
     * Route for the delete method on a single class 
     * The request is routed through a middleware that check the existence of the id of the class to delete
     * The middlewares check the validity of token and the role of the user
     * Then the request is routed to the appropriate class controller function for deleteById
    */
    this.app.delete('/api/v1/classes/:id',[
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classMiddleware.validateClassExists,
      classController.deleteById
    ]);

    /** Define the route for the delete method on the entire collection of classes
     * The middlewares check the validity of token and the role of the user
     * The request is routed to class controller function for deleteAll
    */
    this.app.delete('/api/v1/classes',[
      jwtMiddleware.validateJWT,
      classMiddleware.onlySecretaryNeedsToDoThis,
      classController.deleteAll
    ]);
  }
}