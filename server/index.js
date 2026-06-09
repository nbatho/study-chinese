import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.config.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
await connectDB();

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`  Server is running on port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
