import axios from "axios";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./i18n.ts";
import "./index.css";
import ApiError from "./services/ApiError.ts";
import AuthService from "./services/auth/AuthService.ts";
import store from "./store/index.ts";

/* Configuring base URL for axios, withCredentials to send http only cookies when making requests */
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URI;
axios.defaults.withCredentials = true;

/* Refresh Token */

/* Flag to check if token refresh is in progress */
let refreshingTokenInProgress = false;

/* Axios response intercepto */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {

    /* If an error has occurred from refresh token api */
    if (error?.config?.url?.includes("refresh-token")) {
      return Promise.reject(error);
    }
    /*If the response status is 401, and the requested api end point is not login api  */
    if (
      error?.response?.status === 401 &&
      !error?.config?.url?.includes("login") &&
      !refreshingTokenInProgress
    ) {

      /* Refreshing the token */
      refreshingTokenInProgress = true;

      const response = await AuthService.refreshAccessToken();

      refreshingTokenInProgress = false;

      /* Refresh token success */
      if (!(response instanceof ApiError)) {
        /* Replay the original request */
        return axios(error.config);
      }
    }

    /* Other errors */
    return Promise.reject(error);
  }
);
/* Axios Instance For Country API */
export const axiosCountryApi = axios.create({
  baseURL: import.meta.env.VITE_COUNTRY_API,
  withCredentials: false
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
