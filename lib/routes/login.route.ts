import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { LoginMiddleware } from '../middlewares/login.middleware'
import { LoginController } from '../controllers/login.controller'
import { JwtMiddleware } from '../middlewares/jwt.middleware';


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
    const loginMiddleware: LoginMiddleware = new LoginMiddleware();
    const loginController: LoginController = new LoginController();
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    this.app.post('/api/v1/login', [
      loginMiddleware.validateLoginBody,
      loginMiddleware.verifyEmailAndPassword,
      loginController.createJWT
    ]);

    this.app.post('/api/v1/login/refresh', [
      jwtMiddleware.validateRefreshTokenField,
      jwtMiddleware.validateRefreshTokenContent,
      loginController.createJWT
    ]);
  }
}