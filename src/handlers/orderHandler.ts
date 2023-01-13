import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orderModel';
import jwt from 'jsonwebtoken';
import config from '../lib/config';
import verifyAuthToken from '../middlewares/auth';
import { idText } from 'typescript';

const store = new OrderStore();

//Handler function to show all orders that exist
const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

//Handler function to show all active orders for current user
const showUserOrders = async (req: Request, res: Response) => {
  try {
    const order = await store.showUserOrders(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

//Handler function for creating an order for a specific user
const createOrder = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      completed: false
    };

    const newOrder = await store.createOrder(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//Handler function to update order completion status
const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await store.updateOrder(req.body.id, req.body.completed);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//Handler function to set products to orders
const setProductToOrder = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity } = req.body;

    const newOrderProduct = await store.setProduct(product_id, parseInt(req.params.id as unknown as string), quantity);
    res.json(newOrderProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//Order routes
const order_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.post('/orders/:id', verifyAuthToken, setProductToOrder);
  app.get('/orders/:id', verifyAuthToken, showUserOrders);
  app.patch('/orders', verifyAuthToken, updateOrder);
  app.post('/orders', verifyAuthToken, createOrder);
};

export default order_routes;
