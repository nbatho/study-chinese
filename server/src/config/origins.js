import { env } from './env.config.js';

export const trustedOrigins = new Set(
  [
    env.CLIENT_URL,
    ...(env.CLIENT_URLS ? env.CLIENT_URLS.split(',') : []),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ]
    .map((origin) => origin?.trim())
    .filter(Boolean)
);
