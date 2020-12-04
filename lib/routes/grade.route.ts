import { Application } from 'express'
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { JwtMiddleware } from '../middlewares/jwt.middleware';
import { GradeController } from '../controllers/grade.controller';
import { GradeMiddleware } from '../middlewares/grade.middleware';

//TODO... Decides who can access to these methods

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
    const gradeMiddleware: GradeMiddleware = new GradeMiddleware();


    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    //TODO define in a better way the users' permissions to perform this
    /**
     * Route for the get method (retreive resource) for the grades of a class
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares remove all the invalid query fields
     * The middlewares also check that the referred class exist
     * Then the request is routed to the appropriate grade controller function for list
    */
    this.app.get('/api/v1/classes/:id/grades',[
      jwtMiddleware.validateJWT,
      gradeMiddleware.discardUselessFieldsQuery,
      gradeMiddleware.validateClassExists,
      grade.list
    ]);

    /**
     * Route for the get method (retreive resource) on a single grade of a class
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares check that the referred class exist
     * Then the request is routed to the appropriate grade controller function for getById
    */
    this.app.get('/api/v1/classes/:id/grades/:idg',[
      jwtMiddleware.validateJWT,
      gradeMiddlware.validateClassExists,
      grade.getById
    ]);

    //TODO define in a better way the users' permissions to perform this
    /**
     * Route for the post method (create resource) on a single grade 
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares also check that the referred class exist
     * The middlewares check the validity of the value, date, subject, descript, student
     * Then the request is routed to the appropriate grade controller function for create
    */
    this.app.post('/api/v1/classes/:id/grades',[
      jwtMiddleware.validateJWT,
      gradeMiddleware.validateClassExistsInCreate,
      gradeMiddleware.validateValue,
      gradeMiddleware.validateDate,
      gradeMiddleware.validateSubject,
      gradeMiddleware.validateDescription,
      gradeMiddleware.validateStudent,
      grade.create
    ]);

    this.app.patch('/api/v1/classes/:id/grades/:grade_id',[
      jwtMiddleware.validateJWT,
      gradeMiddleware.discardUselessFields,
      gradeMiddleware.validateClassExists,
      gradeMiddleware.validateUpdateBody,
      gradeMiddleware.validateUpdateRequest,
      grade.updateById
    ]);
  }
}
