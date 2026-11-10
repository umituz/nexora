import { useLocalStorage } from "./useLocalStorage";
import { useCallback } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

const MOCK_USER: AuthUser = {
  id: "user-1",
  name: "Alex Rivera",
  email: "alex@acme.inc",
  avatar: "",
  plan: "Standard",
};

export function useAuth() {
  const [user, setUser, removeUser] = useLocalStorage<AuthUser | null>("ts_auth_user", null);

  const signIn = useCallback(
    (_email: string, _password: string) => {
      setUser(MOCK_USER);
      return true;
    },
    [setUser],
  );

  const signUp = useCallback(
    (_name: string, _email: string, _password: string) => {
      setUser({ ...MOCK_USER, name: _name, email: _email });
      return true;
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    removeUser();
  }, [removeUser]);

  return {
    user,
    isAuthenticated: user !== null,
    signIn,
    signUp,
    signOut,
  };
}
