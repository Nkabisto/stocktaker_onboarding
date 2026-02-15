import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Fixed spelling to 'Unauthorized' with a 'z'
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.on('connect', () => console.log('✅ Database connected'));

pool.on('error', (err) => {
  console.error('❌ Database error: ', err);
  process.exit(-1);
});

// Use 'export' instead of 'module.exports'
export const query = (text, params) => pool.query(text, params);

