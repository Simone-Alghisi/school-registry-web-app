import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { YourselfController } from '../controllers/yourself.controller';

/**
 * YourselfRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/yourself_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class YourselfRoutes extends CommonRoutes implements ConfigureRoutes {

  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'YourselfRoutes');
    this.configureRoutes();
  }

  configureRoutes(): void {
    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();
    /** Instance of yourself controller that implements the logic of rest method*/
    const yourselfController: YourselfController = new YourselfController();

    /**
     * Route for the get method on the resource 'yourself'
     * The request is routed only to yourself controller function for get
    */
    this.app.get('/api/v1/yourself', [
      jwtMiddleware.validateJWT,
      yourselfController.get
    ]);
  }
}