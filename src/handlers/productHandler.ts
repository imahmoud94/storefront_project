import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/productModel';
import verifyAuthToken from '../middlewares/auth';

const store = new ProductStore();

//Handler function to show all products that exist
const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

//Handler function to show specific product
const showProduct = async (req: Request, res: Response) => {
  try {
    const product = await store.showProduct(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

//Handler function for creating a product
const createProduct = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      product_name: req.body.product_name,
      price: req.body.price
    };

    const newProduct = await store.createProduct(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', showProduct);
  app.post('/products', verifyAuthToken, createProduct);
};

export default product_routes;
