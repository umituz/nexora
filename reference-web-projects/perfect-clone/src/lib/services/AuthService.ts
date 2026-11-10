import type { IAuthRepository, AuthUser, AuthResult } from "@/lib/interfaces/repository";

/**
 * Auth Service — business logic for authentication.
 * Depends on IAuthRepository interface, not a specific implementation.
 */
export class AuthService {
  constructor(private readonly authRepo: IAuthRepository) {}

  async signUp(email: string, password: string, fullName?: string): Promise<AuthResult> {
    if (!email || !password) return { user: null, error: "Email and password are required" };
    if (password.length < 6) return { user: null, error: "Password must be at least 6 characters" };

    const metadata = fullName ? { full_name: fullName } : undefined;
    return this.authRepo.signUp(email, password, metadata);
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!email || !password) return { user: null, error: "Email and password are required" };
    return this.authRepo.signIn(email, password);
  }

  async signOut(): Promise<void> {
    return this.authRepo.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    if (!email) throw new Error("Email is required");
    return this.authRepo.resetPassword(email);
  }

  async updatePassword(password: string): Promise<void> {
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");
    return this.authRepo.updatePassword(password);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.authRepo.getCurrentUser();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return this.authRepo.onAuthStateChange(callback);
  }
}
