import Client from '../database';
import config from '../lib/config';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
};

const hashPass = (password: string) => {
  return bcrypt.hashSync(password + config.pepper, parseInt(config.salt as string));
};

export class UserStore {
  //Create User
  async create(user: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO users (user_name, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [user.user_name, user.first_name, user.last_name, hashPass(user.password)]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to create user. Error: ${err}`);
    }
  }
  //Get all users
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Couldn't get users. Error: ${err}`);
    }
  }
  //Show specific user
  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }
  //Update user
  async update(user: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE users SET user_name=$1, first_name=$2, last_name=$3, password=$4 WHERE id=$5 RETURNING *';
      const result = await conn.query(sql, [
        user.user_name,
        user.first_name,
        user.last_name,
        hashPass(user.password),
        user.id
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to update user ${user.id}. Error: ${err}`);
    }
  }
  //Delete user
  async delete(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }
  //Auth user
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT password FROM users WHERE user_name=($1)';
      const result = await conn.query(sql, [username]);

      //console.log(password + config.pepper);

      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + config.pepper, user.password)) {
          const userData = await conn.query(
            `SELECT id, user_name, first_name, last_name FROM users WHERE user_name=($1)`,
            [username]
          );

          const finalUserData = { ...userData.rows[0], ...user };
          //console.log(finalUserData);
          return finalUserData;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`User does not exist. Error ${err}`);
    }
  }
}
