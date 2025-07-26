import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { jwtDecode } from "jwt-decode";
import App from "@/App";
import { api } from "@/lib/axios";

// Define your User type
type User = {
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticate: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticate: false,
});

export const useUser = () => {
  return React.useContext(UserContext);
};

type JWTPayload = {
  name: string;
  email: string;
  exp?: number;
  [key: string]: any;
};

export const UserProvider = ({ children }: PropsWithChildren<object>) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  console.log(user);
  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.post("/auth/authenticate", { token });
        const { exp, name, email } = res.data;

        if (!exp || exp * 1000 > Date.now()) {
          setUser({ name, email });
          setIsAuthenticate(true);
          const timeout = exp ? exp * 1000 - Date.now() : 0;
          const timer = setTimeout(() => logout(), timeout);
          return () => clearTimeout(timer);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const { name, email } = decoded;
      localStorage.setItem("token", token);
      setUser({ name, email });
      setIsAuthenticate(true);
    } catch (error) {
      console.error("Login failed: Invalid token", error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticate(false);
    sessionStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticate }}>
      {children}
    </UserContext.Provider>
  );
};
