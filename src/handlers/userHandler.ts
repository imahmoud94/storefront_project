import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/userModel';
import jwt from 'jsonwebtoken';
import config from '../lib/config';
import verifyAuthToken from '../middlewares/auth';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };

    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const updatedUser = await store.update(req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const erase = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(404);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;
  try {
    const u = await store.authenticate(user_name, password);
    const token = jwt.sign({ user: u }, config.tokenSecret as unknown as string);
    if (!u) {
      return res.status(401).json('Wrong combination of username and password.');
    }
    res.json(token);
  } catch (err) {
    res.status(401);
    res.json({ err });
  }
};

const user_routes = (app: express.Application) => {
  app.post('/users/auth', authenticate);
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.patch('/users', verifyAuthToken, update);
  app.delete('/users/:id', verifyAuthToken, erase);
};

export default user_routes;
