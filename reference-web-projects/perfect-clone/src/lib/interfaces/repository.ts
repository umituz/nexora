/**
 * Generic Repository Interface — database-agnostic contract.
 * All repository implementations (Supabase, Firebase, etc.) must implement this.
 */
export interface IRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  getAll(filters?: Record<string, unknown>): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Auth Repository Interface — abstracts authentication provider.
 */
export interface IAuthRepository {
  signUp(email: string, password: string, metadata?: Record<string, string>): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error?: string;
}
