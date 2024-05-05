import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import { AddressClass, AddressListClass } from "./AddressTypes";

class AddressService {
  BASE_URL = "/api/v1/ecommerce/addresses";
  defaultPageLimit = 50;
  defaultPageNumber = 1;
  async createAddress(
    country: string,
    state: string,
    city: string,
    addressLine1: string,
    addressLine2: string = "",
    pincode: string = ""
  ): Promise<boolean | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);

    const response = await apiRequest.postRequest<AddressClass>({
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      pincode,
    });

    if (response instanceof ApiResponse && response.success) {
      return true;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async updateAddress(
    addressId: string,
    country: string,
    state: string,
    city: string,
    addressLine1: string,
    addressLine2: string = "",
    pincode: string = ""
  ): Promise<boolean | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${addressId}`);

    const response = await apiRequest.patchRequest<AddressClass>({
      country,
      state,
      city,
      addressLine1,
      addressLine2,
      pincode,
    });

    if (response instanceof ApiResponse && response.success) {
      return true;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async deleteAddress(addressId: string): Promise<boolean | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${addressId}`);

    const response = await apiRequest.deleteRequest<AddressClass>();

    if (response instanceof ApiResponse && response.success) {
      return true;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  /* Get All Addresses Asynchronously: As the requests keep fulfilling response will be sent as callback */
  async getAllAddressesAsync(
    callback: (
      data: AddressClass[],
      isDone: boolean,
      errorMessage?: ApiError
    ) => void
  ) {
    /* API Request */
    const apiRequest = new ApiRequest(this.BASE_URL);

    /* Initializing Page Number Counter */
    let pageNumberCounter = this.defaultPageNumber;

    /* First Request to know the total pages */
    const firstResponse = await apiRequest.getRequest<AddressListClass>({
      page: pageNumberCounter,
      limit: this.defaultPageLimit,
    });

    /* If the first request is successful */
    if (firstResponse instanceof ApiResponse && firstResponse.success) {
      /* Total Number of Pages */
      const totalPages = firstResponse.data.totalPages;

      /* Incrementing page counter */
      pageNumberCounter++;

      /* Number of requests to be made */
      let requestsPending = totalPages - pageNumberCounter + 1;

      /* If first request is the last request: return */
      if (!requestsPending) {
        return callback(firstResponse.data.addresses, true);
      } else {
        callback(firstResponse.data.addresses, false);
      }

      /* Remaining requests made in parallel */
      for (let counter = pageNumberCounter; counter <= totalPages; counter++) {
        apiRequest
          .getRequest<AddressListClass>({
            page: counter,
            limit: this.defaultPageLimit,
          })
          .then((res) => {
            /* Decrementing pending requests count */
            requestsPending--;

            /* Error in request: Return */
            if (!(res instanceof ApiResponse && res.success)) {
              return res instanceof ApiError
                ? callback([], true, res)
                : callback([], true, new ApiError(res.message));
            } else if (!requestsPending) {
              /* All Requests are done */
              return callback(res.data.addresses, true);
            } else {
              /* Sending the data of an in between request */
              callback(res.data.addresses, false);
            }
          });
      }
    } else {
      // Error
      return firstResponse instanceof ApiError
        ? callback([], true, firstResponse)
        : callback([], true, new ApiError(firstResponse.message));
    }
  }
}

export default new AddressService();
