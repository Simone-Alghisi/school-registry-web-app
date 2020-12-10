import { Application } from 'express';
import { CommonRoutes } from '../common/routes/common.routes'
import { ConfigureRoutes } from '../common/interfaces/configureRoutes.interface'
import { CommunicationController } from '../controllers/communication.controller';
import { CommunicationMiddleware } from '../middlewares/communication.middleware';
import { JwtMiddleware } from '../middlewares/jwt.middleware';

/**
 * CommunicationRoutes class, it extends the {@link CommonRoutes} class and implements the {@link ConfigureRoutes} interface.
 * It aims to manage all the requests received for the resource _/communication.
 * It sets the middlewares and the methods that should be called for a specific operation
 */
export class CommunicationRoutes extends CommonRoutes implements ConfigureRoutes {

  /**
   * Constructor that calls the consutructor of CommonRoutes and calls the method that define all the routes
   * 
   * @param app instance of the node.js server
   */
  constructor(app: Application){
    super(app, 'CommunicationRoutes');
    this.configureRoutes();
  }

  /**
   * Configures the route for each HTTP method in the CRUD interfaces for classes resources 
   */
  configureRoutes(): void {
    /** Instance of communication controller that implements the logic of rest method*/
    const communicationController: CommunicationController = new CommunicationController();
    /** Instance of communication middleware that checks every request on class resources*/
    const communicationMiddleware: CommunicationMiddleware = new CommunicationMiddleware();
    /** Instance of jwt middleware that checks if a client has a valid token*/
    const jwtMiddleware: JwtMiddleware = new JwtMiddleware();

    /**
     * Route for the get method (retrieve resource) for the communications that the user received
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares check if the user exists in the system 
     * The middlewares also check that the communications requested are the ones of the user
     * Then the request is routed to the appropriate communication controller function for list
    */
    this.app.get('/api/v1/users/:id/communications', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.validateUserExists,
      communicationMiddleware.requestMyCommunication,
      communicationController.list
    ]);

    /**
     * Route for the get method (retrieve resource) for a particular communication that the user received
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares check that the communication requested is one of the user
     * The middlewares check if the user exists in the system 
     * The middlewares also check if the communication exist in the profile of the user
     * Then the request is routed to the appropriate communication controller function for getById
    */
    this.app.get('/api/v1/users/:id/communications/:idc', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.requestOnlyMyCommunication,
      communicationMiddleware.validateUserExists,
      communicationMiddleware.validateCommunicationExists,
      communicationController.getById
    ]);

    /**
     * Route for the get method (retrieve resource) for the communications sent by secretaries
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares also check that the user's role is 2 (i.e. must be a secretary)
     * Then the request is routed to the appropriate communication controller function for getById
    */
    this.app.get('/api/v1/communications', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.requestMySendedCommunication,
      communicationController.list
    ]);

    /**
     * Route for the get method (retrieve resource) for a particular communication sent by secretaries
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * The middlewares check that the user's role is 2 (i.e. must be a secretary)
     * The middlewares also check if the communication exist
     * Then the request is routed to the appropriate communication controller function for list
    */
    this.app.get('/api/v1/communications/:id', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.onlySecretaryNeedsToDoThis,
      communicationMiddleware.validateCommunicationExistsWithoutUser,
      communicationController.getSendedById
    ]);

    /**
     * Route for the post method (create resource) for a particular communication sent by secretaries
     * The request is routed through a series of middlewares that check the validity of the JWT token
     * 
    */
    this.app.post('/api/v1/users/:id/communications', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.onlySecretaryNeedsToDoThis, //For now, only the secretariat can
      communicationMiddleware.validateUserExists,
      communicationMiddleware.discardUselessFields,
      communicationMiddleware.validateSubject,
      communicationMiddleware.validateContent,
      communicationMiddleware.validateDate,
      communicationMiddleware.setSenderAndSenderRole,
      communicationController.create
    ]);

    this.app.patch('/api/v1/users/:id/communications', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.validateUserExists,
      communicationController.updateAll
    ]);

    this.app.patch('/api/v1/users/:id/communications/:idc', [
      jwtMiddleware.validateJWT,
      communicationMiddleware.validateUserExists,
      communicationMiddleware.validateCommunicationExists,
      communicationController.updateById
    ]);

    this.app.delete('/api/v1/users/:id/communications',[
      jwtMiddleware.validateJWT,
      communicationMiddleware.validateUserExists,
      communicationController.deleteById
    ]);

    this.app.delete('/api/v1/users/:id/communications/:idc',[
      jwtMiddleware.validateJWT,
      communicationMiddleware.validateUserExists,
      communicationMiddleware.validateCommunicationExists,
      communicationController.deleteAll
    ]);
  }
}