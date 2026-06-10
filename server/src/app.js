import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.js';
import { env } from './config/env.config.js';
import { healthCheck } from './controllers/health.controller.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api/v1', apiRoutes);

// Backward-compatible aliases for earlier local development routes.
app.get('/api/health', healthCheck);
app.use('/api/words', (req, res) => res.redirect(308, '/api/v1/vocab'));
app.use('/api/profile', (req, res) => res.redirect(308, '/api/v1/users/profile'));

app.use('/api', notFoundHandler);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
