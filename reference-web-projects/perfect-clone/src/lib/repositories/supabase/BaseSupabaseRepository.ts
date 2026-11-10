import { supabase } from "@/integrations/supabase/client";
import type { IRepository } from "@/lib/interfaces/repository";

/**
 * Generic Supabase Repository — implements IRepository for any table.
 * Uses `as any` for Supabase's strict generic table typing while maintaining
 * external type safety through the IRepository<T> interface.
 */
export class BaseSupabaseRepository<T extends { id: string }> implements IRepository<T> {
  constructor(protected readonly tableName: string) {}

  async getAll(filters?: Record<string, unknown>): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from as any)(this.tableName).select("*");

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "all") {
          query = query.eq(key, value);
        }
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(`[${this.tableName}] getAll failed: ${error.message}`);
    return (data ?? []) as T[];
  }

  async getById(id: string): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from as any)(this.tableName)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`[${this.tableName}] getById failed: ${error.message}`);
    return (data as T) ?? null;
  }

  async create(item: Partial<T>): Promise<T> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const payload = { ...item, user_id: user.id };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from as any)(this.tableName)
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(`[${this.tableName}] create failed: ${error.message}`);
    return data as T;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from as any)(this.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`[${this.tableName}] update failed: ${error.message}`);
    return data as T;
  }

  async delete(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from as any)(this.tableName)
      .delete()
      .eq("id", id);
    if (error) throw new Error(`[${this.tableName}] delete failed: ${error.message}`);
  }
}
