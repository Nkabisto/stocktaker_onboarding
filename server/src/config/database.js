import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? (rejectUnauthorised: false) : false
});

// Test connection on startup
pool.on('connect', ()=>console.log('✅ Database connected'));
pool.on('error', (err)=>{
  console.error('❌ Database error: ', err);
  process.exit(-1);
});

// Helper function to run queries
// const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
  pool
};
```
