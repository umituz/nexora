import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/lib/storage";
import { MOCK_USER } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getStorageItem<User | null>(STORAGE_KEYS.AUTH_USER, null)
  );

  useEffect(() => {
    if (user) {
      setStorageItem(STORAGE_KEYS.AUTH_USER, user);
    }
  }, [user]);

  const login = useCallback((email: string, _password: string) => {
    const mockUser: User = { ...MOCK_USER, email };
    setUser(mockUser);
    setStorageItem(STORAGE_KEYS.AUTH_USER, mockUser);
    return true;
  }, []);

  const register = useCallback((data: { firstName: string; lastName: string; email: string }) => {
    const newUser: User = {
      ...MOCK_USER,
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
    setUser(newUser);
    setStorageItem(STORAGE_KEYS.AUTH_USER, newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
