import dotenv from 'dotenv';

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let query, pool, close, connectDatabase, getClient, closePool;

if (DB_TYPE === 'sqlite') {
  // Use SQLite
  const sqlite = await import('./sqlite.js');
  query = sqlite.query;
  close = sqlite.close;
  pool = null;
  getClient = null;
  
  connectDatabase = async function() {
    console.log('📦 SQLite database ready');
    return true;
  };
  
  closePool = async function() {
    close();
    console.log('Database closed');
  };
  
  console.log('📦 Using SQLite database');
} else {
  // Use PostgreSQL
  const pg = await import('pg');
  const { Pool } = pg.default;

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'crowdk_wallet',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  /**
   * Test database connection
   */
  connectDatabase = async function() {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('Database connected at:', result.rows[0].now);
      client.release();
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  };

  /**
   * Execute a query
   */
  query = async function(text, params) {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.LOG_LEVEL === 'debug') {
        console.log('Executed query:', { text, duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  };

  /**
   * Get a client from the pool (for transactions)
   */
  getClient = async function() {
    return await pool.connect();
  };

  /**
   * Close all connections
   */
  closePool = async function() {
    await pool.end();
    console.log('Database pool closed');
  };

  console.log('🐘 Using PostgreSQL database');
}

export { query, getClient, connectDatabase, closePool, pool };
export default { query, getClient, connectDatabase, closePool };
