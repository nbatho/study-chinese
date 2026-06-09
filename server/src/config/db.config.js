/**
 * Mock Database connection setup.
 * Replace this with Mongoose (MongoDB) or Sequelize/Prisma (SQL) configuration.
 */
export const connectDB = async () => {
  try {
    console.log('Connecting to database...');
    // Simulated connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
