import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import { OrderClass, OrderListClass } from "../order/OrderTypes";
import { ProfileClass } from "./ProfileTypes";

class ProfileService {
  BASE_URL = "/api/v1/ecommerce/profile";

  defaultPageNumber = 1;
  defaultPageLimit = 50;

  async getUserProfile(): Promise<ProfileClass | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);
    const response = await apiRequest.getRequest<ProfileClass>();

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async updateUserProfile(
    countryCode: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ): Promise<ProfileClass | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);
    const response = await apiRequest.patchRequest<ProfileClass>({
      countryCode,
      firstName,
      lastName,
      phoneNumber,
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async getUsersOrdersAsync(
    callback: (data: OrderClass[], isDone: boolean, error?: ApiError) => void
  ) {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/my-orders`);

    let page = this.defaultPageNumber;
    const firstResponse = await apiRequest.getRequest<OrderListClass>({
      page,
      limit: this.defaultPageLimit,
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
          .getRequest<OrderListClass>({ page, limit: this.defaultPageLimit })
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
}

export default new ProfileService();
