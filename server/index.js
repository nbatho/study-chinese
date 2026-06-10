import 'dotenv/config';
import app from './src/app.js';
import { env } from './src/config/env.config.js';
import { connectDB } from './src/config/db.config.js';

const PORT = env.PORT;

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`  Server is running on port: ${PORT}`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api/v1`);
  console.log(`=================================`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
