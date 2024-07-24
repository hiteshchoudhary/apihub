import axios, { AxiosError } from "axios";
import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import {
  GeneratePayPalOrderResponseClass,
  OrderClass,
  OrderDetailClass,
  OrderListClass,
} from "./OrderTypes";
import { ORDER_STATUS } from "../../data/applicationData";

class OrderService {
  BASE_ORDERS_URL = "/api/v1/ecommerce/orders";
  BASE_URL = "/api/v1/ecommerce/orders/provider";
  defaultPageNumber = 1;
  defaultPageLimit = 50;

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

  async getOrdersAsync(
    status: ORDER_STATUS | undefined,
    callback: (data: OrderClass[], isDone: boolean, error?: ApiError) => void
  ) {
    const apiRequest = new ApiRequest(`${this.BASE_ORDERS_URL}/list/admin`);

    let page = this.defaultPageNumber;

    const firstResponse = await apiRequest.getRequest<OrderListClass>({
      page,
      limit: this.defaultPageLimit,
      status: status,
    });

    if (firstResponse instanceof ApiResponse && firstResponse.success) {
      const totalPages = firstResponse.data.totalPages;

      page++;
      let requestsPending = totalPages - page + 1;

      if (!requestsPending) {
        return callback(firstResponse.data.orders, true);
      } else {
        callback(firstResponse.data.orders, false);
      }

      for (page; page <= totalPages; page++) {
        apiRequest
          .getRequest<OrderListClass>({
            page,
            limit: this.defaultPageLimit,
            status: status,
          })
          .then((res) => {
            requestsPending--;

            /* Error in request: Return */
            if (!(res instanceof ApiResponse && res.success)) {
              return res instanceof ApiError
                ? callback([], true, res)
                : callback([], true, new ApiError(res.message));
            } else if (!requestsPending) {
              /* All Requests are done */
              return callback(res.data.orders, true);
            } else {
              /* Sending the data of an in between request */
              callback(res.data.orders, false);
            }
          });
      }
    } else if (firstResponse instanceof ApiResponse) {
      return callback([], false, new ApiError(firstResponse.message));
    } else {
      return callback([], false, firstResponse);
    }
  }

  async editOrderStatus(
    status: ORDER_STATUS,
    orderId: string
  ): Promise<{ status: ORDER_STATUS } | ApiError> {
    const apiRequest = new ApiRequest(
      `${this.BASE_ORDERS_URL}/status/${orderId}`
    );

    const response = await apiRequest.patchRequest<{ status: ORDER_STATUS }>({
      status,
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }
}

export default new OrderService();
