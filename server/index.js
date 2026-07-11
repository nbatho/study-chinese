import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './src/config/env.config.js';
import { trustedOrigins } from './src/config/origins.js';
import { connectDB, closeDB } from './src/config/db.config.js';
import apiRoutes from './src/routes/api.routes.js';
import { healthCheck } from './src/controllers/health.controller.js';
import { requestLogger } from './src/middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './src/middlewares/error.middleware.js';
import { generalRateLimit, requestId, securityHeaders } from './src/middlewares/security.middleware.js';

const PORT = env.PORT;
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', env.TRUST_PROXY);
app.use(requestId);
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || trustedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true
  })
);
// Large base64 payloads are only expected on specific endpoints;
// everything else gets a tight default limit.
app.use('/api/v1/ocr/scan', express.json({ limit: '10mb' }));
app.use(['/api/v1/practice/shadowing/score', '/api/v1/practice/pronunciation/check'], express.json({ limit: '4mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(generalRateLimit);

app.use('/api/v1', apiRoutes);

// Backward-compatible aliases for earlier local development routes.
app.get('/api/health', healthCheck);
app.use('/api/words', (req, res) => res.redirect(308, '/api/v1/vocab'));
app.use('/api/profile', (req, res) => res.redirect(308, '/api/v1/users/profile'));
app.use('/api-docs', (req, res) => res.redirect(308, '/api/v1/docs'));

app.use('/api', notFoundHandler);
app.use(notFoundHandler);
app.use(errorHandler);

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`  Server is running on port: ${PORT}`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api/v1`);
  console.log(`  Docs: http://localhost:${PORT}/api/v1/docs`);
  console.log(`=================================`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Closing HTTP server and database pool...`);
  server.close(async () => {
    await closeDB();
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
