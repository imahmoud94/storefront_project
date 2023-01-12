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
  //Show orders from a specific user
  async showUserOrders(id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const result = await conn.query(sql, [id]);
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
}
