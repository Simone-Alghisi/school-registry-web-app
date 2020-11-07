import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { UserController } from  '../controllers/user.controller'

export class UserRoutes extends CommonRoutes implements ConfigureRoutes {

  constructor(app: Application){
    super(app, 'UserRoutes');
    this.configureRoutes();
  }

  configureRoutes(): void {
    const userController:UserController = new UserController();

    this.app.get('/users', [
      userController.list
    ]);
  }
}