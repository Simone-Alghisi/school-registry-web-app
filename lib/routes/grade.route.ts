import { Application } from 'express'
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { GradeController } from '../controllers/grade.controller';
import { GradeMiddleware } from '../middlewares/grade.middleware';


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
    const gradeMiddlware: GradeMiddleware = new GradeMiddleware();


    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    //TODO define in a better way the users' permissions to perform this
    this.app.get('/api/v1/classes/:id/grades',[
      jwtMiddleware.validateJWT,
      gradeMiddlware.validateClassExists,
      grade.list
    ]);

    //TODO define in a better way the users' permissions to perform this
    this.app.post('/api/v1/classes/:id/grades',[
      jwtMiddleware.validateJWT,
      gradeMiddlware.validateClassExistsInCreate,
      gradeMiddlware.validateValue,
      gradeMiddlware.validateDate,
      gradeMiddlware.validateSubject,
      gradeMiddlware.validateDescription,
      gradeMiddlware.validateStudent,
      grade.create
    ]);
  }
}
