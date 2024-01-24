import { LocalStorage } from "@/utils";
import axios from "axios";

// axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

// Add an interceptor to set authorization header with user token before requests
axios.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const loginApi = (email: string, password: string) => {
  return axios.post(
    "/api/v1/users/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const registerApi = (email: string, password: string, username: string) => {
  return axios.post(
    "/api/v1/users/register",
    { email, password, username },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export { loginApi, registerApi };
