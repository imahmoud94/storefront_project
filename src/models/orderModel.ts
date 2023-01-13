import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  completed: boolean;
};

export type OrderProducts = {
  id?: number;
  product_id: number;
  order_id: number;
  quantity: number;
};

export class OrderStore {
  //Get all orders
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Couldn't get orders. Error: ${err}`);
    }
  }
  //Show current active orders from a specific user
  async showUserOrders(user_id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE user_id=($1) AND completed='false';`;
      const result = await conn.query(sql, [user_id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not find orders ${id}. Error: ${err}`);
    }
  }
  //Create Order
  async createOrder(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO orders (user_id, completed) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [o.user_id, o.completed]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create order. Error: ${err}`);
    }
  }
  //Update completion status of an order
  async updateOrder(id: number, completed: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET id=$1, completed=$2 RETURNING *';
      const result = await conn.query(sql, [id, completed]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update order ${id}. Error: ${err}`);
    }
  }

  //Update orders with products
  async setProduct(product_id: number, order_id: number, quantity: number): Promise<OrderProducts> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE id=($1)`;
      const result = (await conn.query(sql, [order_id])).rows[0];
      if (result.completed !== false) {
        throw new Error('Order is already completed');
      }
    } catch (err) {
      throw new Error(`Could not find order. Error:${err}`);
    }

    try {
      const conn = await Client.connect();
      const sql = `INSERT INTO order_products (product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [product_id, order_id, quantity]);

      return result.rows[0];
    } catch (err) {
      throw new Error(`Failed to update order. Error: ${err}`);
    }
  }
}
