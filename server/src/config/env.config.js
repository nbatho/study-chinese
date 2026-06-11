export const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api/v1',

  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SSL: process.env.DB_SSL === 'true',
  DB_MAX_CONNECTIONS: Number(process.env.DB_MAX_CONNECTIONS || 10),
  DB_IDLE_TIMEOUT_MS: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  SKIP_DB_CONNECT: process.env.SKIP_DB_CONNECT === 'true',

  JWT_SECRET: process.env.JWT_SECRET || 'change-this-dev-secret',
  JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS || 604800),
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: Number(
    process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS || 2592000
  ),

  AI_PROVIDER: process.env.AI_PROVIDER || 'mock',
  OCR_PROVIDER: process.env.OCR_PROVIDER || 'mock'
};

export const isProduction = env.NODE_ENV === 'production';

const isUnsafeJwtSecret =
  !env.JWT_SECRET ||
  env.JWT_SECRET === 'change-this-dev-secret' ||
  env.JWT_SECRET.length < 32;

if (isProduction && isUnsafeJwtSecret) {
  throw new Error('JWT_SECRET must be set to a strong value with at least 32 characters in production.');
}

export const hasDatabaseConfig = () => {
  if (env.DATABASE_URL) {
    return true;
  }

  return Boolean(env.DB_HOST && env.DB_NAME && env.DB_USER);
};
