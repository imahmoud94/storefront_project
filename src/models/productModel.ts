import Client from '../database';

export type Product = {
  id?: number;
  product_name: string;
  price: number;
};

export class ProductStore {
  //Get all products
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Couldn't get users. Error: ${err}`);
    }
  }
  //Show specific product
  async showProduct(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }
  //Create Product
  async createProduct(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO products (product_name, price) VALUES ($1, $2) RETURNING *';
      const result = await conn.query(sql, [p.product_name, p.price]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create product. Error: ${err}`);
    }
  }
}
