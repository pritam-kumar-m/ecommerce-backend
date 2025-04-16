export interface IService<T> {
  getById(id: string): Promise<T | null>;
  getAll(filter?: any): Promise<{ 
    data: T[]; 
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
      totalItems: number;
    }
  }>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
} 