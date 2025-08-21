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
  _id: string;
  name: string;
  email: string;
  avatar: string;
  posts: number;
  apply: number;
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
    _id: "",
    name: "",
    email: "",
    avatar: "",
    posts: 0,
    apply: 0,
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
    _id: "",
    name: "",
    email: "",
    avatar: "",
    posts: 0,
    apply: 0,
    followers: 0,
    following: 0,
  });
  console.log("user", user);
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  async function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.post("/auth/authenticate", { token });

        const {
          userId,
          exp,
          name,
          email,
          avatar,
          posts,
          apply,
          followers,
          following,
        } = res.data;

        if (!exp || exp * 1000 > Date.now()) {
          setUser({
            _id: userId,
            name,
            email,
            avatar,
            posts,
            apply,
            followers,
            following,
          });
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

      const {
        userId,
        name,
        email,
        avatar,
        posts,
        apply,
        followers,
        following,
      } = decoded;
      setUser({
        _id: userId || "",
        name: name || "",
        email: email || "",
        avatar: avatar || "",
        posts: posts || 0,
        apply: apply || 0,
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
      _id: "",
      name: "",
      email: "",
      avatar: "",
      posts: 0,
      apply: 0,
      followers: 0,
      following: 0,
    });
    setIsAuthenticate(false);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticate }}>
      {children}
    </UserContext.Provider>
  );
};
