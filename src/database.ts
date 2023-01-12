import { Pool } from 'pg';
import config from './lib/config';

const pool = new Pool({
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password
});

pool.on('error', (error: Error) => {
  console.error(error.message);
});

export default pool;
