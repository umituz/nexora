import { supabase } from "@/integrations/supabase/client";
import type { IAuthRepository, AuthUser, AuthResult } from "@/lib/interfaces/repository";

function mapUser(supaUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): AuthUser | null {
  if (!supaUser) return null;
  return {
    id: supaUser.id,
    email: supaUser.email ?? "",
    displayName: (supaUser.user_metadata?.full_name as string) ?? supaUser.email ?? "",
    avatarUrl: supaUser.user_metadata?.avatar_url as string | undefined,
  };
}

export class SupabaseAuthRepository implements IAuthRepository {
  async signUp(email: string, password: string, metadata?: Record<string, string>): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { user: null, error: error.message };
    return { user: mapUser(data.user) };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: mapUser(data.user) };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return mapUser(user);
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(mapUser(session?.user ?? null));
    });
    return () => subscription.unsubscribe();
  }
}
