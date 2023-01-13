import { User, UserStore } from '../userModel';
import { Product, ProductStore } from '../productModel';
import { Order, OrderStore } from '../orderModel';
import Client from '../../database';
import { Connection } from 'pg';

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe('Order Model Function Tests', () => {
  describe('Order Model Functions Exist', () => {
    it('Index function exists', () => {
      expect(orderStore.index).toBeDefined();
    });

    it('Create order function exists', () => {
      expect(orderStore.createOrder).toBeDefined();
    });

    it('Show users current orders function exists', () => {
      expect(orderStore.showUserOrders).toBeDefined();
    });

    it('Update order function exists', () => {
      expect(orderStore.updateOrder).toBeDefined();
    });

    it('Set product to orders function exists', () => {
      expect(orderStore.setProduct).toBeDefined();
    });
  });

  const userData: User = {
    user_name: 'newuser',
    first_name: 'Ibrahim',
    last_name: 'Mahmoud',
    password: 'testing123'
  };

  beforeAll(async () => {
    const createdUser = await userStore.create(userData);
    const createdProduct = await productStore.createProduct({ product_name: 'Apple', price: 10 });
    const createdProduct2 = await productStore.createProduct({ product_name: 'Banana', price: 20 });
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
  it('Create order returns the correct new order', async () => {
    const createdOrder = await orderStore.createOrder(newOrder);
    expect(createdOrder.user_id).toBe(1);
    expect(createdOrder.completed).toBe(false);
  });

  it('Index shows all available orders', async () => {
    await orderStore.createOrder(newOrder);
    const result = await orderStore.index();
    expect(result.length).toBe(2);
  });

  it('Update order should return updated order', async () => {
    const updatedOrder = await orderStore.updateOrder(2, 'true');
    expect(updatedOrder.id).toBe(2);
    expect(updatedOrder.user_id).toBe(1);
    expect(updatedOrder.completed).toBe(true);
  });

  it('Show orders should return only the not completed orders of the user which is 1 now', async () => {
    const result = await orderStore.showUserOrders('1');

    expect(result.length).toBe(1);
  });

  it('Set product should set products to order successfully', async () => {
    const orderProd1 = await orderStore.setProduct(1, 1, 10);

    expect(orderProd1.product_id).toBe(1);
    expect(orderProd1.quantity).toBe(10);
  });
});

describe('Product Model Function Tests', () => {
  describe('Product Model Functions Exist', () => {
    it('Index function exists', () => {
      expect(productStore.index).toBeDefined();
    });

    it('Show product function exists', () => {
      expect(productStore.showProduct).toBeDefined();
    });

    it('Create product function exists', () => {
      expect(productStore.createProduct).toBeDefined();
    });
  });
  const newProduct: Product = { product_name: 'Banana', price: 20 };

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;';
    await conn.query(sql);
    conn.release();
  });

  it('Create product should return new product', async () => {
    const createdProduct = await productStore.createProduct(newProduct);

    expect(createdProduct.id).toBe(1);
    expect(createdProduct.product_name).toBe('Banana');
    expect(parseInt(createdProduct.price as unknown as string)).toBe(20);
  });

  it('Index should show all available products', async () => {
    await productStore.createProduct({ product_name: 'Apple', price: 20 });
    await productStore.createProduct({ product_name: 'Watermelon', price: 10 });

    const result = await productStore.index();
    expect(result.length).toBe(3);
  });

  it('Show product should return one specificied product', async () => {
    const result = await productStore.showProduct('3');
    expect(result.product_name).toBe('Watermelon');
    expect(parseInt(result.price as unknown as string)).toBe(10);
  });
});

describe('User Model Function Tests', () => {
  describe('User Model Functions Exist', () => {
    it('Authenticate function exists', async () => {
      expect(userStore.authenticate).toBeDefined();
    });

    it('Create function exists', async () => {
      expect(userStore.create).toBeDefined();
    });

    it('Index function exists', async () => {
      expect(userStore.index).toBeDefined();
    });
    it('Show function exists', async () => {
      expect(userStore.show).toBeDefined();
    });
    it('Update function exists', async () => {
      expect(userStore.update).toBeDefined();
    });

    it('Delete function exists', () => {
      expect(userStore.delete).toBeDefined();
    });
  });
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

  it('Authenticated user returned should be same as created user', async () => {
    const authUser = await userStore.authenticate(userData.user_name, userData.password);
    expect(authUser?.user_name).toBe(userData.user_name);
    expect(authUser?.first_name).toBe(userData.first_name);
    expect(authUser?.last_name).toBe(userData.last_name);
  });

  it('Authenticate returns null for wrong combination of user and password', async () => {
    const authUser = await userStore.authenticate('failuser', 'badpass');
    expect(authUser).toBe(null);
  });

  it('Create user should return the correct new user', async () => {
    const userData2: User = {
      user_name: 'newuser2',
      first_name: 'Omar',
      last_name: 'Mahmoud',
      password: 'testing1234'
    };

    const newUser = await userStore.create(userData2);
    expect(newUser?.id).toBe(2);
    expect(newUser?.user_name).toBe(userData2.user_name);
    expect(newUser?.first_name).toBe(userData2.first_name);
    expect(newUser?.last_name).toBe(userData2.last_name);
  });

  it('Index should return all current users', async () => {
    const result = await userStore.index();
    expect(result.length).toBe(2);
  });

  it('Show user should return only one specific user', async () => {
    const result = await userStore.show('2');
    expect(result.id).toBe(2);
    expect(result.first_name).toBe('Omar');
  });

  it('Update should return the updated user with the new values', async () => {
    const editedUser = {
      id: 1,
      user_name: 'newuser',
      first_name: 'Ali',
      last_name: 'Mahmoud',
      password: 'testing123'
    };
    const updatedUser = await userStore.update(editedUser);
    expect(updatedUser.id).toBe(1);
    expect(updatedUser.user_name).toBe(userData.user_name);
    expect(updatedUser.first_name).toBe('Ali');
  });

  it('Delete function should delete user successfully', async () => {
    const deletedUser = await userStore.delete('1');
    expect(deletedUser.id).toBe(1);
  });
});
