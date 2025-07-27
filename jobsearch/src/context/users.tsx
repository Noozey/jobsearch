import React, {
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/axios";

// Define your User type
type User = {
  name: string;
  email: string;
  avatar: string;
  posts: number;
  followers: number;
  following: number;
};

type UserContextType = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticate: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: {
    name: "",
    email: "",
    avatar: "",
    posts: 0,
    followers: 0,
    following: 0,
  },
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
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    avatar: "",
    posts: 0,
    followers: 0,
    following: 0,
  });
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.post("/auth/authenticate", { token });
        console.log(res);
        const { exp, name, email, avatar, posts, followers, following } =
          res.data;

        if (!exp || exp * 1000 > Date.now()) {
          setUser({ name, email, avatar, posts, followers, following });
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
      const { name, email, avatar, posts, followers, following } = decoded;
      setUser({
        name: name || "",
        email: email || "",
        avatar: avatar || "",
        posts: posts || 0,
        followers: followers || 0,
        following: following || 0,
      });
      setIsAuthenticate(true);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  const logout = () => {
    setUser({
      name: "",
      email: "",
      avatar: "",
      posts: 0,
      followers: 0,
      following: 0,
    });
    setIsAuthenticate(false);
    sessionStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticate }}>
      {children}
    </UserContext.Provider>
  );
};
