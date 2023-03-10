import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import user_routes from './handlers/userHandler';
import order_routes from './handlers/orderHandler';
import product_routes from './handlers/productHandler';
import cors from 'cors';

const app: express.Application = express();
const address = '0.0.0.0:3000';

const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
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
order_routes(app);
product_routes(app);

export default app;
