import { Product, Category } from '@prisma/client';

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
  _count?: {
    products: number;
  };
}

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  tags?: string[];
  availability?: boolean;
  minSalePrice?: number;
  maxSalePrice?: number;
}

export interface CategoryFilter {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  sku: string;
  tags?: string[];
  sale_price?: number;
  price: number;
  cost_price: number;
  retail_price: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  availability?: boolean;
  custom_fields?: Record<string, any>;
  categoryId: string;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {} 