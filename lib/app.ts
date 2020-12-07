import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserRoutes } from './routes/user.route';
import { ClassRoutes } from './routes/class.route';
import { CommonRoutes } from './common/routes/common.routes'
import { LoginRoutes } from './routes/login.route';
import { GradeRoutes } from './routes/grade.route';
import { CommunicationRoutes } from './routes/communication.route';
import { YourselfRoutes } from './routes/yourself.route';

/**
 * Exdends the Express request object with a jwt field
 */
declare global {
  namespace Express {
    interface Request {
      jwt: any
    }
  }
}

//Dotenv configuration
dotenv.config();

//Get the port
/**Port on which the server will listen onto */
const port = process.env.PORT;

/**Express instance */
const app: Application = express();

/**Array containing all the routes */
const routes: CommonRoutes[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * Exposing public folder
 */
app.use('/', express.static('public'));
/**
 * Enabling CORS, respond to the OPTION HTTP verb
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, HEAD, PUT, POST, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  } else {
    return next();
  }
});


/**
 * Routes that needs to be configured
 */
routes.push(new UserRoutes(app));
routes.push(new ClassRoutes(app));
routes.push(new LoginRoutes(app));
routes.push(new GradeRoutes(app));
routes.push(new CommunicationRoutes(app));
routes.push(new YourselfRoutes(app));

/**
 * Configuring all the routes
 */
app.listen(port, () => {
  console.log('Server running on port: ' + port)
  routes.forEach((route: CommonRoutes) => {
    console.log('Routes configured for ' + route.getName());
  });
});

/**
 * Default 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

export default app;