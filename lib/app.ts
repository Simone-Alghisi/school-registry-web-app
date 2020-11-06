import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

//Dotenv configuration
dotenv.config();

//Get the port
const port = process.env.PORT;

const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World')
});

app.listen(port, () => console.log('Server running on port: ' + port));

export default app;