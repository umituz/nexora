import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { mockUser, type MockUser } from "@/lib/mock-data";
import { getFromStorage, setToStorage, removeFromStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() =>
    getFromStorage<MockUser | null>(STORAGE_KEYS.AUTH_USER, null)
  );

  const isAuthenticated = user !== null;

  useEffect(() => {
    if (user) {
      setToStorage(STORAGE_KEYS.AUTH_USER, user);
    } else {
      removeFromStorage(STORAGE_KEYS.AUTH_USER);
    }
  }, [user]);

  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    // Mock login - always succeeds
    await new Promise((r) => setTimeout(r, 500));
    setUser(mockUser);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 500));
    setUser({ ...mockUser, name, email });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
