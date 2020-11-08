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

    this.app.get('/api/v1/users', [
      userController.list
    ]);

    this.app.get('/api/v1/users/:id', [
      userController.getById
    ]);

    this.app.post('/api/v1/users', [
      userController.create
    ]);

    this.app.patch('/api/v1/users', [
      userController.updateAll
    ]);

    this.app.patch('/api/v1/users/:id', [
      userController.updateById
    ]);

    this.app.delete('/api/v1/users/:id',[
      userController.deleteById
    ]);

    this.app.delete('/api/v1/users',[
      userController.deleteAll
    ]);
  }
}