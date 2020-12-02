import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { LoginMiddleware } from '../middlewares/login.middleware'
import { LoginController } from '../controllers/login.controller'
import { JwtMiddleware } from '../middlewares/jwt.middleware';

/**
 * LoginRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/login_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class LoginRoutes extends CommonRoutes implements ConfigureRoutes {

  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'LoginRoutes');
    this.configureRoutes();
  }

  configureRoutes(): void {
    /**
     * Login middleware, checks the value for the user authentication
     */
    const loginMiddleware: LoginMiddleware = new LoginMiddleware();
    /**
     * Login controller, creates and refreshes the JWTs
     */
    const loginController: LoginController = new LoginController();
    /**
     * JWT middlewares, check for the validity of JWTs
     */
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    /**
     * Route for the post method (create resource) on a single grade 
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares also check that the referred class exist
     * The middlewares check the validity of the value, date, subject, descript, student
     * Then the request is routed to the appropriate grade controller function for create
    */
    this.app.post('/api/v1/login', [
      loginMiddleware.validateLoginBody,
      loginMiddleware.verifyEmailAndPassword,
      loginController.createJWT
    ]);

    /**
     * Route for the post method (create resource) on a single grade 
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares also check that the referred class exist
     * The middlewares check the validity of the value, date, subject, descript, student
     * Then the request is routed to the appropriate grade controller function for create
    */
    this.app.post('/api/v1/login/refresh', [
      jwtMiddleware.validateRefreshTokenField,
      jwtMiddleware.validateRefreshTokenContent,
      loginController.refreshJWT
    ]);
  }
}