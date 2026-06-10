import pg from 'pg';
import { env, hasDatabaseConfig } from './env.config.js';

const { Pool } = pg;

let pool;

const createPoolConfig = () => {
  if (!hasDatabaseConfig()) {
    return null;
  }

  const common = {
    max: env.DB_MAX_CONNECTIONS,
    idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined
  };

  if (env.DATABASE_URL) {
    return {
      connectionString: env.DATABASE_URL,
      ...common
    };
  }

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ...common
  };
};

export const getPool = () => {
  if (!pool) {
    const config = createPoolConfig();

    if (!config) {
      throw new Error(
        'Missing PostgreSQL configuration. Set DATABASE_URL or DB_HOST, DB_NAME and DB_USER in server/.env.'
      );
    }

    pool = new Pool(config);
    pool.on('error', (error) => {
      console.error('Unexpected PostgreSQL pool error:', error);
    });
  }

  return pool;
};

export const connectDB = async () => {
  if (env.SKIP_DB_CONNECT) {
    console.log('Database connection skipped because SKIP_DB_CONNECT=true.');
    return;
  }

  const result = await getPool().query('SELECT now() AS now');
  console.log(`Database connected successfully at ${result.rows[0].now.toISOString()}`);
};

export const query = (text, params = []) => getPool().query(text, params);

export const withTransaction = async (callback) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closeDB = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
