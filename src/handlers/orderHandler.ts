import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orderModel';
import jwt from 'jsonwebtoken';
import config from '../lib/config';
import verifyAuthToken from '../middlewares/auth';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

const order_routes = (app: express.Application) => {
  app.get('/orders', index);
};

export default order_routes;
