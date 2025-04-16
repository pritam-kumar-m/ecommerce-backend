import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const connectToMongo = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection is successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Re-throw the error to handle it in the application
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default connectToMongo;
