import express from 'express';
import cors from 'cors';
import { Container } from './core/container';
import connectToMongo from '../database/db';
import { ErrorHandler } from './infrastructure/middleware/errorHandler';

const app = express();
const container = Container.getInstance();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ecommerce app is running');
});

// Routes
app.use('/api/products', container.getProductRoutes().getRouter());
app.use('/api/categories', container.getCategoryRoutes().getRouter());
app.use('/api/auth', container.getAuthRoutes().getRouter());
app.use('/api/inventory', container.getInventoryRoutes().getRouter());
app.use('/api/orders', container.getOrderRoutes().getRouter());
app.use('/api/vendors', container.getVendorRoutes().getRouter());
// Error handling
app.use(ErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectToMongo();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
