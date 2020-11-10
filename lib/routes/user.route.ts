import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { UserController } from  '../controllers/user.controller'
import { UserMiddleware } from '../middlewares/user.middleware'

/**
 * UserRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/users_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class UserRoutes extends CommonRoutes implements ConfigureRoutes {

  constructor(app: Application){
    super(app, 'UserRoutes');
    this.configureRoutes();
  }

  configureRoutes(): void {
    const userController: UserController = new UserController();
    const userMiddleware: UserMiddleware = new UserMiddleware();

    this.app.get('/api/v1/users', [
      userController.list
    ]);

    this.app.get('/api/v1/users/:id', [
      userMiddleware.validateIdParams,
      userController.getById
    ]);

    this.app.post('/api/v1/users', [
      userMiddleware.validateName,
      userMiddleware.validateSurname,
      userMiddleware.validateEmail,
      userMiddleware.validatePassword,
      userMiddleware.validateRole,
      userMiddleware.validateBirthDate,
      userController.create
    ]);

    this.app.patch('/api/v1/users', [
      userController.updateAll
    ]);

    this.app.patch('/api/v1/users/:id', [
      userMiddleware.validateIdParams,
      userMiddleware.validateUpdateBody,
      userMiddleware.validateUpdateRequest,
      userController.updateById
    ]);

    this.app.delete('/api/v1/users/:id',[
      userMiddleware.validateIdParams,
      userController.deleteById
    ]);

    this.app.delete('/api/v1/users',[
      userController.deleteAll
    ]);
  }
}