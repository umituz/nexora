import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockUser, type UserProfile } from "@/data/mock-data";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/lib/storage";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() =>
    getStorageItem<UserProfile | null>("dmchamp_user", null)
  );

  const login = useCallback((email: string, _password: string, name?: string) => {
    const loggedInUser: UserProfile = { ...mockUser, email, ...(name ? { name } : {}) };
    setUser(loggedInUser);
    setStorageItem("dmchamp_user", loggedInUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStorageItem("dmchamp_user");
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      setStorageItem("dmchamp_user", updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
