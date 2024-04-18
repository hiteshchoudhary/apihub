import axios from "axios";

import { LocalStorage } from "../utils";

//Creating an axios instance for API requests

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

//Add an interceptor to set authorization header with user token before requests

apiClient.interceptors.request.use(
  function (config) {
    //Retrieve user token from local storage

    const token = LocalStorage.get("token");
    //set authorization header with bearer token
    config.headers.Authorization = `Bearer${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//API function for diffrent actions

const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("/users/login", data);
};

const registerUser = (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return apiClient.post("/users/register", data);
};

const logoutUser = () => {
  return apiClient.post("/users/logout");
};

//Ecommerce API's

const userProfile = () => {
  return apiClient.get("/ecommerce/profile");
};

const updateUserProfile = (data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
}) => {
  return apiClient.patch("/ecommerce/profile", data); //has to re write
};

const userOrders = () => {
  return apiClient.get("/ecommerce/my-orders");
};

const getAllProducts = () => {
  return apiClient.get("/ecommerce/products");
};

const createAProduct = (
  data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  },
  mainImage: File[],
  subImage?: File[]
) => {
  const formData = new FormData();

  // Append each field of the data object to formData
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  // Append mainImage files
  mainImage?.forEach((file) => {
    formData.append("mainImage", file);
  });

  // Append subImage files if provided
  subImage?.forEach((file) => {
    formData.append("subImage", file);
  });

  return apiClient.post("/ecommerce/products", formData);
};

const getProductByProductId = (productId: string) => {
  return apiClient.get(`/ecommerce/products/${productId}`);
};

const deleteProductByProductId = (productId: string) => {
  return apiClient.delete(`/ecommerce/products/${productId}`);
};

const updateProductByProductId = (
  data: {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: string;
  },
  productId: string,
  mainImage?: File[],
  subImage?: File[]
) => {
  const formData = new FormData();

  // Append each field of the data object to formData
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });

  // Append mainImage files
  mainImage?.forEach((file) => {
    formData.append("mainImage", file);
  });

  // Append subImage files if provided
  subImage?.forEach((file) => {
    formData.append("subImage", file);
  });

  return apiClient.patch(`/ecommerce/products/${productId}`, formData);
};

const getProductsByCategory = (categoryId: string) => {
  return apiClient.get(`/ecommerce/products/category/${categoryId}`);
};

const removeSubImageOfAProduct = (productId: string, subImageId: string) => {
  return apiClient.patch(
    `/ecommerce/products/remove/subImage/${productId}/${subImageId}`
  );
};

const getCart = () => {
  return apiClient.get("/ecommerce/cart");
};

const addItemToCart = (productId: string, quantity?: number) => {
  const requestBody = quantity !== undefined ? { quantity } : {};
  return apiClient.post(`/ecommerce/cart/item/${productId}`, requestBody);
};

const removeItemFromCart = (productId: string) => {
  return apiClient.delete(`/ecommerce/cart/item/${productId}`);
};

const clearCart = () => {
  return apiClient.delete("/ecommerce/cart/clear");
};

const getAllCategories = (page?: string, limit?: string) => {
  const queryParams: { [key: string]: string } = {};

  if (page !== undefined) {
    queryParams["page"] = page;
  }

  if (limit !== undefined) {
    queryParams["limit"] = limit;
  }

  return apiClient.get("/ecommerce/categories", { params: queryParams });
};

const createCategory = (name: string) => {
  return apiClient.post("/ecommerce/categories", { name });
};

const getCategoryById = (categoryId: string) => {
  return apiClient.get(`/ecommerce/categories/${categoryId}`);
};

const deleteCategoryById = (categoryId: string) => {
  return apiClient.delete(`/ecommerce/categories/${categoryId}`);
};

const updateCategoryById = (categoryId: string, name: string) => {
  return apiClient.patch(`/ecommerce/categories/${categoryId}`, { name });
};

const getAllCoupons = (page?: string, limit?: string) => {
  const queryParams: { [key: string]: string } = {};

  if (page !== undefined) {
    queryParams["page"] = page;
  }

  if (limit !== undefined) {
    queryParams["limit"] = limit;
  }

  return apiClient.get("/ecommerce/coupons", { params: queryParams });
};

const createCoupon = (data: {
  name: string;
  couponCode: string;
  type: string;
  discountValue: number;
  minimumCartValue: number;
  startDate: string;
  expiryDate: string;
}) => {
  return apiClient.post("/ecommerce/coupons", data);
};

const couponsAvailableForCustomer = (page?: string, limit?: string) => {
  const queryParams: { [key: string]: string } = {};

  if (page !== undefined) {
    queryParams["page"] = page;
  }

  if (limit !== undefined) {
    queryParams["limit"] = limit;
  }

  return apiClient.get("/ecommerce/coupons/customer/available", {
    params: queryParams,
  });
};
const getCouponById = (couponId: string) => {
  return apiClient.get(`/ecommerce/coupons/${couponId}`);
};

const deleteCouponById = (couponId: string) => {
  return apiClient.delete(`/ecommerce/coupons/${couponId}`);
};

const updateCouponById = (
  couponId: string,
  data: Partial<{
    name: string;
    couponCode: string;
    type: string;
    discountValue: number;
    minimumCartValue: number;
    startDate: string;
    expiryDate: string;
  }>
) => {
  const payload: Partial<{
    name: string;
    couponCode: string;
    type: string;
    discountValue: number;
    minimumCartValue: number;
    startDate: string;
    expiryDate: string;
  }> = {};

  // Assign properties from data if they exist
  if (data.name !== undefined) payload.name = data.name;
  if (data.couponCode !== undefined) payload.couponCode = data.couponCode;
  if (data.type !== undefined) payload.type = data.type;
  if (data.discountValue !== undefined)
    payload.discountValue = data.discountValue;
  if (data.minimumCartValue !== undefined)
    payload.minimumCartValue = data.minimumCartValue;
  if (data.startDate !== undefined) payload.startDate = data.startDate;
  if (data.expiryDate !== undefined) payload.expiryDate = data.expiryDate;

  return apiClient.patch(`/ecommerce/coupons/${couponId}`, payload);
};

const applyCoupons = (couponCode: string) => {
  return apiClient.post("/ecommerce/coupons/apply", { couponCode });
};

const removeCoupons = (couponCode: string) => {
  return apiClient.post("/ecommerce/coupons/c/remove", { couponCode });
};

const toggleActiveStatusOfCoupon = (couponId: string, isActive: boolean) => {
  return apiClient.patch(`/ecommerce/coupons/status/${couponId}`, { isActive });
};

const getAllAddresses = (page?: string, limit?: string) => {
  const queryParams: { [key: string]: string } = {};
  if (page !== undefined) queryParams["page"] = page;
  if (limit !== undefined) queryParams["limit"] = limit;

  return apiClient.get("/ecommerce/addresses", { params: queryParams });
};

const getAddress = (addressId: string) => {
  return apiClient.get(`/ecommerce/addresses/${addressId}`);
};

const deleteAddress = (addressId: string) => {
  return apiClient.delete(`/ecommerce/addresses/${addressId}`);
};

const updateAddress = (
  addressId: string,
  data: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  }
) => {
  return apiClient.patch(`/ecommerce/addresses/${addressId}`, data);
};

const getFullOrderListAdmin = (
  status?: string,
  limit?: string,
  page?: string
) => {
  const queryParams: { [key: string]: string } = {};

  if (status !== undefined) queryParams["status"] = status;
  if (limit !== undefined) queryParams["limit"] = limit;
  if (page !== undefined) queryParams["page"] = page;

  return apiClient.get("/ecommerce/orders/list/admin", { params: queryParams });
};

const getOrdersById = (orderId: string) => {
  return apiClient.get(`/ecommerce/orders/${orderId}`);
};

const generateRazorPayOrder = (addressId: string) => {
  return apiClient.post("/ecommerce/orders/provider/razorpay", { addressId });
};

const generatePaypalOrder = (addressId: string) => {
  return apiClient.post("/ecommerce/orders/provider/paypal", { addressId });
};

const verifyRazorpayPayment = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return apiClient.post(
    "/ecommerce/orders/provider/razorpay/verify-payment",
    data
  );
};

const verifyPaypalPayment = (addressId: string) => {
  return apiClient.post("/ecommerce/orders/provider/razorpay/verify-payment", {
    addressId,
  });
};

const updateOrderStatusAdmin = (orderId: string) => {
  return apiClient.patch(`/ecommerce/orders/status/${orderId}`);
};

export {
  loginUser,
  registerUser,
  logoutUser,
  userProfile,
  updateUserProfile,
  userOrders,
  getAllCoupons,
  getAllProducts,
  createAProduct,
  getProductByProductId,
  deleteProductByProductId,
  updateProductByProductId,
  getProductsByCategory,
  removeSubImageOfAProduct,
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategoryById,
  updateCategoryById,
  createCoupon,
  couponsAvailableForCustomer,
  getCouponById,
  deleteCouponById,
  updateCouponById,
  applyCoupons,
  removeCoupons,
  toggleActiveStatusOfCoupon,
  getAllAddresses,
  getAddress,
  deleteAddress,
  updateAddress,
  getFullOrderListAdmin,
  getOrdersById,
  generatePaypalOrder,
  generateRazorPayOrder,
  verifyPaypalPayment,
  verifyRazorpayPayment,
  updateOrderStatusAdmin,
};
