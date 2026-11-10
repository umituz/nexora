import type { IRepository } from "@/lib/interfaces/repository";

/**
 * Generic Service Layer — contains business logic, delegates data operations to repository.
 * Services are database-agnostic; they only depend on the IRepository interface.
 */
export class BaseService<T extends { id: string }, TCreate = Partial<T>, TUpdate = Partial<T>> {
  constructor(protected readonly repository: IRepository<T, TCreate, TUpdate>) {}

  async getAll(filters?: Record<string, unknown>): Promise<T[]> {
    return this.repository.getAll(filters);
  }

  async getById(id: string): Promise<T | null> {
    if (!id) throw new Error("ID is required");
    return this.repository.getById(id);
  }

  async create(data: TCreate): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: TUpdate): Promise<T> {
    if (!id) throw new Error("ID is required");
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    if (!id) throw new Error("ID is required");
    return this.repository.delete(id);
  }
}
