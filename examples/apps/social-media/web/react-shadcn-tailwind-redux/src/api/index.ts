import { LocalStorage } from "@/utils";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 100000;

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

// functions that returns axios instance to make api request

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

const logoutApi = () => {
  return axios.post("/api/v1/users/logout");
};

const getOthersPostApi = ({ page = 1 }: { page: number }) => {
  return axios.get(`/api/v1/social-media/posts?page=${page}`);
};

const getUserPostsApi = ({
  page = 1,
  username,
}: {
  page: number;
  username: string;
}) => {
  return axios.get(`/api/v1/social-media/posts/get/u/${username}?page=${page}`);
};

const likeDislikePostApi = (postId: string) => {
  return axios.post(`/api/v1/social-media/like/post/${postId}`);
};

const getUserProfileApi = (username: string) => {
  return axios.get(`/api/v1/social-media/profile/u/${username}`);
};

const followUnfollowApi = (toBeFollowedUserId: string) => {
  return axios.post(`/api/v1/social-media/follow/${toBeFollowedUserId}`);
};

const getUserFollowersApi = (username: string, page: number) => {
  return axios.get(
    `/api/v1/social-media/follow/list/followers/${username}?page=${page}`
  );
};

const getUserFollowingsApi = (username: string, page: number) => {
  return axios.get(
    `/api/v1/social-media/follow/list/following/${username}?page=${page}`
  );
};

const updateCoverImageApi = (formData: FormData) => {
  return axios.patch("/api/v1/social-media/profile/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateAvatarApi = (formData: FormData) => {
  return axios.patch("/api/v1/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateProfileApi = (data: {
  firstName?: string;
  lastName?: string;
  bio?: string;
  dob?: Date | string;
  countryCode?: string;
  phoneNumber?: string;
  location?: string;
}) => {
  return axios.patch("/api/v1/social-media/profile", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export {
  loginApi,
  registerApi,
  logoutApi,
  getOthersPostApi,
  likeDislikePostApi,
  getUserProfileApi,
  getUserPostsApi,
  followUnfollowApi,
  getUserFollowersApi,
  getUserFollowingsApi,
  updateCoverImageApi,
  updateAvatarApi,
  updateProfileApi,
};
