import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../infrastructure/repositories/product.repository';
import { CategoryRepository } from '../infrastructure/repositories/category.repository';
import { ProductService } from '../domain/services/product.service';
import { CategoryService } from '../domain/services/category.service';
import { AuthService } from '../domain/services/auth.service';
import { ProductController } from '../modules/product/controllers/product.controller';
import { CategoryController } from '../modules/product/controllers/category.controller';
import { AuthController } from '../modules/auth/controllers/auth.controller';
import { ProductRoutes } from '../modules/product/routes/product.routes';
import { CategoryRoutes } from '../modules/product/routes/category.routes';
import { AuthRoutes } from '../modules/auth/routes/auth.routes';
import { UserRoutes } from '../modules/auth/routes/user.routes';
import { UserController } from '../modules/auth/controllers/user.controller';
import { UserService } from '../modules/auth/services/user.service';
import { InventoryRepository } from '../infrastructure/repositories/inventory.repository';
import { InventoryService } from '../domain/services/inventory.service';
import { InventoryController } from '../modules/inventory/controllers/inventory.controller';
import { InventoryRoutes } from '../modules/inventory/routes/inventory.routes';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderService } from '../domain/services/order.service';
import { OrderController } from '../modules/order/controllers/order.controller';
import { OrderRoutes } from '../modules/order/routes/order.routes';
import { VendorRepository } from '../infrastructure/repositories/vendor.repository';
import { VendorService } from '../domain/services/vendor.service';
import { VendorController } from '../modules/vendor/controllers/vendor.controller';
import { VendorRoutes } from '../modules/vendor/routes/vendor.routes';

export class Container {
  private static instance: Container;
  private prisma: PrismaClient;
  private repositories: {
    product: ProductRepository;
    category: CategoryRepository;
    inventory: InventoryRepository;
    order: OrderRepository;
    vendor: VendorRepository;
  };
  private services: {
    product: ProductService;
    category: CategoryService;
    auth: AuthService;
    inventory: InventoryService;
    order: OrderService;
    vendor: VendorService;
    user: UserService;
  };
  private controllers: {
    product: ProductController;
    category: CategoryController;
    auth: AuthController;
    inventory: InventoryController;
    order: OrderController;
    vendor: VendorController;
    user: UserController;
  };
  private routes: {
    product: ProductRoutes;
    category: CategoryRoutes;
    auth: AuthRoutes;
    inventory: InventoryRoutes;
    order: OrderRoutes;
    vendor: VendorRoutes;
    user: UserRoutes;
  };

  private constructor() {
    this.prisma = new PrismaClient();
    
    // Initialize empty objects
    this.repositories = {} as any;
    this.services = {} as any;
    this.controllers = {} as any;
    this.routes = {} as any;
    
    this.initializeDependencies();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initializeDependencies(): void {
    // Initialize repositories
    this.repositories.product = new ProductRepository(this.prisma);
    this.repositories.category = new CategoryRepository(this.prisma);
    this.repositories.inventory = new InventoryRepository(this.prisma);
    this.repositories.order = new OrderRepository(this.prisma);
    this.repositories.vendor = new VendorRepository(this.prisma);

    // Initialize services
    this.services = {
      product: new ProductService(this.repositories.product, this.repositories.category),
      category: new CategoryService(this.repositories.category),
      auth: new AuthService(this.prisma),
      inventory: new InventoryService(this.repositories.inventory),
      order: new OrderService(
        this.repositories.order,
        this.repositories.product,
        this.repositories.inventory
      ),
      vendor: new VendorService(this.repositories.vendor),
      user: new UserService(),
    };

    // Initialize controllers
    this.controllers = {
      product: new ProductController(this.services.product),
      category: new CategoryController(this.services.category),
      auth: new AuthController(this.services.auth),
      inventory: new InventoryController(this.services.inventory),
      order: new OrderController(this.services.order),
      vendor: new VendorController(this.services.vendor),
      user: new UserController(this.services.user),
    };

    // Initialize routes
    this.routes = {
      product: new ProductRoutes(this.controllers.product),
      category: new CategoryRoutes(this.controllers.category),
      auth: new AuthRoutes(this.controllers.auth),
      inventory: new InventoryRoutes(this.controllers.inventory),
      order: new OrderRoutes(this.controllers.order),
      vendor: new VendorRoutes(this.controllers.vendor),
      user: new UserRoutes(this.controllers.user),
    };
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public getProductRepository(): ProductRepository {
    return this.repositories.product;
  }

  public getCategoryRepository(): CategoryRepository {
    return this.repositories.category;
  }

  public getProductService(): ProductService {
    return this.services.product;
  }

  public getCategoryService(): CategoryService {
    return this.services.category;
  }

  public getAuthService(): AuthService {
    return this.services.auth;
  }

  public getProductController(): ProductController {
    return this.controllers.product;
  }

  public getCategoryController(): CategoryController {
    return this.controllers.category;
  }

  public getAuthController(): AuthController {
    return this.controllers.auth;
  }

  public getProductRoutes(): ProductRoutes {
    return this.routes.product;
  }

  public getCategoryRoutes(): CategoryRoutes {
    return this.routes.category;
  }

  public getAuthRoutes(): AuthRoutes {
    return this.routes.auth;
  }

  public getInventoryRepository(): InventoryRepository {
    return this.repositories.inventory;
  }

  public getInventoryService(): InventoryService {
    return this.services.inventory;
  }

  public getInventoryController(): InventoryController {
    return this.controllers.inventory;
  }

  public getInventoryRoutes(): InventoryRoutes {
    return this.routes.inventory;
  }

  public getOrderRepository(): OrderRepository {
    return this.repositories.order;
  }

  public getOrderService(): OrderService {
    return this.services.order;
  }

  public getOrderController(): OrderController {
    return this.controllers.order;
  }

  public getOrderRoutes(): OrderRoutes {
    return this.routes.order;
  }

  public getVendorRoutes() {
    return this.routes.vendor;
  }

  public getUserRoutes(): UserRoutes {
    return this.routes.user;
  }
}