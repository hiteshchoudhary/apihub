import axios, { AxiosError } from "axios";
import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import {
  GeneratePayPalOrderResponseClass,
  OrderDetailClass
} from "./OrderTypes";

class OrderService {
  BASE_ORDERS_URL = "/api/v1/ecommerce/orders";
  BASE_URL = "/api/v1/ecommerce/orders/provider";

  async generatePayPalOrder(
    addressId: string
  ): Promise<GeneratePayPalOrderResponseClass | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/paypal`);

    const response =
      await apiRequest.postRequest<GeneratePayPalOrderResponseClass>({
        addressId,
      });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async verifyPayment(orderId: string): Promise<boolean | ApiError> {
    try {
      await axios.post(`${this.BASE_URL}/paypal/verify-payment`, { orderId });

      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        return new ApiError(error.message, error, error.response?.data);
      }
      return new ApiError("");
    }
  }

  async getOrderDetail(orderId: string): Promise<OrderDetailClass | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_ORDERS_URL}/${orderId}`);

    const response = await apiRequest.getRequest<OrderDetailClass>();

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }
}

export default new OrderService();
