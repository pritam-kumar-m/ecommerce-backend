import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { BaseRouter } from '../../../api/routes/BaseRouter';
import { Role, InventoryLevel } from '@prisma/client';

export class InventoryRoutes extends BaseRouter<InventoryLevel> {
  constructor(controller: InventoryController) {
    super(controller, true, [Role.ADMIN]);
    this.initializeInventoryRoutes();
  }

  private initializeInventoryRoutes(): void {
    // Public routes
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getById(req, res));

    // Protected routes (admin only)
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.put('/:id', (req, res) => this.controller.update(req, res));
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
    
    // Inventory-specific routes
    this.router.post('/:id/add', (req, res) => (this.controller as InventoryController).addStock(req, res));
    this.router.post('/:id/remove', (req, res) => (this.controller as InventoryController).removeStock(req, res));
    this.router.get('/:id/operations', (req, res) => (this.controller as InventoryController).getOperations(req, res));
}

  public getRouter(): Router {
    return this.router;
  }
} 