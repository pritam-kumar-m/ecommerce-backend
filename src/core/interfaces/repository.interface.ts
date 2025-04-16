export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
  count(filter?: any): Promise<number>;
} 