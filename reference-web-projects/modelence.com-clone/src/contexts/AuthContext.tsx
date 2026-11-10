import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { storage } from "@/lib/storage";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => storage.get("auth", false));
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => storage.get("user", null));
  const [darkMode, setDarkMode] = useState(() => {
    const dm = storage.get("darkMode", false);
    if (dm) document.documentElement.classList.add("dark");
    return dm;
  });

  const login = useCallback((email: string, _password: string) => {
    const u = { name: email.split("@")[0], email };
    setUser(u);
    setIsAuthenticated(true);
    storage.set("auth", true);
    storage.set("user", u);
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string) => {
    const u = { name, email };
    setUser(u);
    setIsAuthenticated(true);
    storage.set("auth", true);
    storage.set("user", u);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    storage.remove("auth");
    storage.remove("user");
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      storage.set("darkMode", next);
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
