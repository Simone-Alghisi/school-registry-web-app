import { Application } from 'express'
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
//import { ClassController } from '../controllers/class.controller';
import { ClassMiddleware } from '../middlewares/class.middleware';
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { GradeController } from '../controllers/grade.controller';


/**
 * GradeRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/classes/{id}/grades_.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class GradeRoutes extends CommonRoutes implements ConfigureRoutes {
  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'GradeRoutes');
    this.configureRoutes();
  }

  configureRoutes(): void {
    /** Instance of class controller that implements the logic of rest method*/
    const grade: GradeController = new GradeController();


    /** Instance of class middleware that checks every request on class resources*/
    const classMiddleware: ClassMiddleware = new ClassMiddleware();


    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    this.app.get('/api/v1/classes/:id/grades',[
      jwtMiddleware.validateJWT,
      classMiddleware.validateClassExists,
      grade.list
    ]);
  }
}
