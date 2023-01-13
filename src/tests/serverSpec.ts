import supertest from 'supertest';
import app from '../server';
import { User, UserStore } from '../models/userModel';
import { Product, ProductStore } from '../models/productModel';
import { Order, OrderStore } from '../models/orderModel';
import Client from '../database';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
let globalToken: string;

describe('Test User API', () => {
  const userData: User = {
    user_name: 'newuser',
    first_name: 'Ibrahim',
    last_name: 'Mahmoud',
    password: 'testing123'
  };

  beforeAll(async () => {
    const createdUser = await userStore.create(userData);
  });

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  describe('Authentication route testing', () => {
    it('Authenticate user successfully if user and pass are correct', async () => {
      const response = await request.post('/users/auth').send({
        user_name: 'newuser',
        password: 'testing123'
      });

      expect(response.status).toBe(200);

      const token = response.body;
      expect(token).toBeDefined();
      globalToken = token;
    });

    it('Authentication should fail on sending wrong user and pass', async () => {
      const response = await request.post('/users/auth').send({
        user_name: 'fakeuser',
        password: 'failtest'
      });

      expect(response.status).toBe(401);
    });
  });

  describe('CRUD operation routes', () => {
    it('Create user route should create successfully', async () => {
      const response = await request.post('/users').send({
        user_name: 'testnewuser',
        first_name: 'test',
        last_name: 'user',
        password: 'test12'
      });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(2);
      expect(response.body.user_name).toBe('testnewuser');
      expect(response.body.first_name).toBe('test');
      expect(response.body.last_name).toBe('user');
    });
    it('Show route should get one specified user', async () => {
      const response = await request.get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.user_name).toBe('newuser');
      expect(response.body.first_name).toBe('Ibrahim');
      expect(response.body.last_name).toBe('Mahmoud');
    });

    it('Index route should get all users created', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('Update route should update user', async () => {
      const response = await request.patch('/users').set('Authorization', `Bearer ${globalToken}`).send({
        id: 1,
        user_name: 'newuser',
        first_name: 'Ali',
        last_name: 'Mahmoud',
        password: 'test1223'
      });
      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Ali');
    });

    it('Delete route should delete the user given id', async () => {
      const response = await request.delete('/users/1').set('Authorization', `Bearer ${globalToken}`);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('Ali');
    });
  });
});

describe('Test Product API', () => {
  const newProduct: Product = { product_name: 'Banana', price: 20 };

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  it('Create product route test', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${globalToken}`)
      .send({ product_name: 'Apple', price: '20' });
    expect(response.status).toBe(200);

    expect(response.body.product_name).toBe('Apple');
    expect(parseInt(response.body.price)).toBe(20);
  });

  it('Index product route test', async () => {
    await request
      .post('/products')
      .set('Authorization', `Bearer ${globalToken}`)
      .send({ product_name: 'Banana', price: '10' });

    const response = await request.get('/products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('Show product route test', async () => {
    const response = await request.get('/products/2');

    expect(response.status).toBe(200);

    expect(response.body.product_name).toBe('Banana');
    expect(parseInt(response.body.price)).toBe(10);
  });
});

describe('Test Order API', () => {
  const userData: User = {
    user_name: 'newuser',
    first_name: 'Ibrahim',
    last_name: 'Mahmoud',
    password: 'testing123'
  };

  beforeAll(async () => {
    const createdUser = await userStore.create(userData);
    await request
      .post('/products')
      .set('Authorization', `Bearer ${globalToken}`)
      .send({ product_name: 'Apple', price: '20' });
  });

  afterAll(async () => {
    const conn = await Client.connect();

    const sql2 = 'DELETE FROM order_products;\nALTER SEQUENCE order_products_id_seq RESTART WITH 1;';
    await conn.query(sql2);
    const sql = 'DELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1;';
    await conn.query(sql);
    const sql4 = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await conn.query(sql4);
    const sql3 = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;';
    await conn.query(sql3);

    conn.release();
  });
  const newOrder: Order = { user_id: 1, completed: false };

  it('Create order route test', async () => {
    const response = await request.post('/orders').set('Authorization', `Bearer ${globalToken}`).send({ user_id: 1 });
    expect(response.status).toBe(200);

    expect(response.body.user_id).toBe(1);
    expect(response.body.completed).toBe(false);
  });

  it('Index orders route test', async () => {
    await request.post('/orders').set('Authorization', `Bearer ${globalToken}`).send(newOrder);
    const response = await request.get('/orders');

    expect(response.status).toBe(200);

    expect(response.body.length).toBe(2);
  });

  it('Update orders route test', async () => {
    const response = await request
      .patch('/orders')
      .set('Authorization', `Bearer ${globalToken}`)
      .send({ id: 1, completed: true });

    expect(response.status).toBe(200);

    expect(response.body.completed).toBe(true);
  });

  it('Show active user orders route test', async () => {
    const response = await request.get('/orders/1').set('Authorization', `Bearer ${globalToken}`);

    expect(response.status).toBe(200);

    expect(response.body.length).toBe(1);
  });

  it('Set product to order of id 1 route test', async () => {
    const response = await request
      .post('/orders/2')
      .set('Authorization', `Bearer ${globalToken}`)
      .send({ product_id: 1, quantity: 10 });

    expect(response.status).toBe(200);
    expect(response.body.product_id).toBe(1);
    expect(response.body.order_id).toBe(2);
    expect(response.body.quantity).toBe(10);
  });
});

describe('Test basic endpoint server', () => {
  it('Get the / endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
