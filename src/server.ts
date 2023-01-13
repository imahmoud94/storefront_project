import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import user_routes from './handlers/userHandler';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());

//Logger middleware
app.use(morgan('common'));

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

user_routes(app);
