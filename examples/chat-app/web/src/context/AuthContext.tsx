import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, registerUser } from "../api";
import Loader from "../components/Loader";
import { UserInterface } from "../interfaces/user";
import { LocalStorage, requestHandler } from "../utils";

const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  const login = async (data: { username: string; password: string }) => {
    await requestHandler(
      async () => await loginUser(data),
      setIsLoading,
      (res) => {
        const { data } = res;
        setUser(data.user);
        setToken(data.accessToken);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.accessToken);
        navigate("/chat");
      },
      alert
    );
  };

  const register = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        alert("Account created successfully! Go ahead and login.");
        navigate("/login");
      },
      alert
    );
  };

  const logout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        LocalStorage.clear();
        navigate("/login");
      },
      alert
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const _token = LocalStorage.get("token");
    const _user = LocalStorage.get("user");
    if (_token && _user?._id) {
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };
