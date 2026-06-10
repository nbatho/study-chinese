import { asyncHandler } from '../utils/async-handler.js';
import { query } from '../config/db.config.js';
import { env } from '../config/env.config.js';
import { success } from '../utils/response.js';

export const healthCheck = asyncHandler(async (req, res) => {
  let database = 'skipped';

  if (!env.SKIP_DB_CONNECT) {
    await query('SELECT 1');
    database = 'ok';
  }

  success(res, {
    message: 'Backend API is running smoothly',
    database,
    timestamp: new Date().toISOString()
  });
});
