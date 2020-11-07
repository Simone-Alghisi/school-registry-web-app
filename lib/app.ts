import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { UserRoutes } from './routes/user.route';
import { CommonRoutes } from './common/routes/common.routes'

//Dotenv configuration
dotenv.config();

//Get the port
const port = process.env.PORT;

const app: Application = express();

const routes: CommonRoutes[] = [];

app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE');
  if (req.method === 'OPTIONS') {
    //TODO define options
    return res.status(200).send();
  } else {
    return next();
  }
});

//Routes defined
routes.push(new UserRoutes(app));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World')
});

app.listen(port, () => {
  console.log('Server running on port: ' + port)
  routes.forEach((route: CommonRoutes) => {
    console.log('Routes configured for ' + route.getName());
  });
});

//Default 404 handler
app.use((req: Request, res: Response) => {
  res.status(404);
  res.json({ error: 'Not found' });
});

export default app;