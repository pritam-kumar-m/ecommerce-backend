import { OrderController } from './controllers/order.controller';
import { OrderRoutes } from './routes/order.routes';
import { OrderService } from '../../domain/services/order.service';
import { OrderRepository } from '../../infrastructure/repositories/order.repository';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';
import { PrismaClient } from '@prisma/client';

export class OrderModule {
  private static instance: OrderModule;
  private prisma: PrismaClient;
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;
  private inventoryRepository: InventoryRepository;
  private orderService: OrderService;
  private orderController: OrderController;
  private orderRoutes: OrderRoutes;

  private constructor() {
    this.prisma = new PrismaClient();
    this.orderRepository = new OrderRepository(this.prisma);
    this.productRepository = new ProductRepository(this.prisma);
    this.inventoryRepository = new InventoryRepository(this.prisma);
    this.orderService = new OrderService(
      this.orderRepository,
      this.productRepository,
      this.inventoryRepository
    );
    this.orderController = new OrderController(this.orderService);
    this.orderRoutes = new OrderRoutes(this.orderController);
  }

  public static getInstance(): OrderModule {
    if (!OrderModule.instance) {
      OrderModule.instance = new OrderModule();
    }
    return OrderModule.instance;
  }

  public getRoutes(): OrderRoutes {
    return this.orderRoutes;
  }
} 