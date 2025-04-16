import { PrismaClient, VendorStatus } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { logger } from '../../core/logger';
import { Vendor, VendorCreateInput, VendorUpdateInput } from '../../domain/entities/vendor.entities';

export class VendorRepository extends BaseRepository<Vendor, VendorCreateInput, VendorUpdateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'vendor');
  }

  async create(data: any) {
    try {
      return await this.prisma.vendor.create({
        data
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.vendor.findUnique({
        where: { id }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      return await this.prisma.vendor.findMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: any) {
    try {
      return await this.prisma.vendor.update({
        where: { id },
        data
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.vendor.delete({
        where: { id }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateStatus(id: string, status: VendorStatus) {
    try {
      return await this.prisma.vendor.update({
        where: { id },
        data: { status }
      });
    } catch (error) {
      this.handleError(error);
    }
  }
} 