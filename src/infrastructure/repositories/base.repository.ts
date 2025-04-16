import { PrismaClient } from '@prisma/client';
import { logger } from '../../core/logger';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient, protected modelName: string) {
    this.prisma = prisma;
  }

  protected handleError(error: any): never {
    logger.error(`Error in ${this.modelName} repository:`, error);
    throw error;
  }
} 