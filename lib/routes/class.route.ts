import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { UserController } from  '../controllers/user.controller'
import { UserMiddleware } from '../middlewares/user.middleware'
import { ClassController } from '../controllers/class.controller';
import { ClassMiddleware } from '../middlewares/class.middleware';

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
   * Configures the route for each HTTP method in the CRUD interfaces for user resources 
   */
  configureRoutes(): void {
    /** Instance of class controller that implement the logic of rest method*/
    const classController: ClassController = new ClassController();
    /** Instance of class middleware that check every request on user resources*/
    const classMiddleware: ClassMiddleware = new ClassMiddleware();

    this.app.get('/api/v1/classes', [
      classController.list
    ]);

    this.app.get('/api/v1/classes/:id', [
      classController.getById
    ]);

    this.app.post('/api/v1/classes', [
      classController.create
    ]);

    this.app.patch('/api/v1/classes', [
      classController.updateAll
    ]);

    this.app.patch('/api/v1/classes/:id', [
      classController.updateById
    ]);

    this.app.delete('/api/v1/classes/:id',[
      classController.deleteById
    ]);

    /** Define the route for the delete method on the entire collection of users
     * The request is routed only to user controller function for deleteAll
    */
    this.app.delete('/api/v1/classes',[
      classController.deleteAll
    ]);
  }
}