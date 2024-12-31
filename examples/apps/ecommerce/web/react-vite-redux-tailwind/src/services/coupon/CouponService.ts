import { AddEditCouponFields, DATE_TIME_FORMATS } from "../../constants";
import { getMomentObjectFromDateObject } from "../../utils/dateTimeHelper";
import ApiError from "../ApiError";
import ApiRequest from "../ApiRequest";
import ApiResponse from "../ApiResponse";
import { UserCart } from "../cart/CartTypes";
import { COUPON_TYPES, CouponClass, CouponListClass } from "./CouponTypes";

class CouponService {
  BASE_URL = "/api/v1/ecommerce/coupons";
  defaultPageLimit = 50;
  defaultPageNumber = 1;

  /* Get All Coupons Asynchronously: As the requests keep fulfilling response will be sent as callback */
  async getAllCouponsAsync(
    callback: (
      data: CouponClass[],
      isDone: boolean,
      errorMessage?: ApiError
    ) => void
  ) {
    /* API Request */
    const apiRequest = new ApiRequest(this.BASE_URL);

    /* Initializing Page Number Counter */
    let pageNumberCounter = this.defaultPageNumber;

    /* First Request to know the total pages */
    const firstResponse = await apiRequest.getRequest<CouponListClass>({
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
        return callback(firstResponse.data.coupons, true);
      } else {
        callback(firstResponse.data.coupons, false);
      }

      /* Remaining requests made in parallel */
      for (let counter = pageNumberCounter; counter <= totalPages; counter++) {
        apiRequest
          .getRequest<CouponListClass>({
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
              return callback(res.data.coupons, true);
            } else {
              /* Sending the data of an in between request */
              callback(res.data.coupons, false);
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

  /* Get All Coupons Available to User Asynchronously: As the requests keep fulfilling response will be sent as callback */
  async getAllCouponsAvailableToUserAsync(
    callback: (
      data: CouponClass[],
      isDone: boolean,
      errorMessage?: ApiError
    ) => void
  ) {
    /* API Request */
    const apiRequest = new ApiRequest(`${this.BASE_URL}/customer/available`);

    /* Initializing Page Number Counter */
    let pageNumberCounter = this.defaultPageNumber;

    /* First Request to know the total pages */
    const firstResponse = await apiRequest.getRequest<CouponListClass>({
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
        return callback(firstResponse.data.coupons, true);
      } else {
        callback(firstResponse.data.coupons, false);
      }

      /* Remaining requests made in parallel */
      for (let counter = pageNumberCounter; counter <= totalPages; counter++) {
        apiRequest
          .getRequest<CouponListClass>({
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
              return callback(res.data.coupons, true);
            } else {
              /* Sending the data of an in between request */
              callback(res.data.coupons, false);
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

  async applyCouponCode(couponCode: string): Promise<UserCart | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/c/apply`);
    const response = await apiRequest.postRequest<UserCart>({ couponCode });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async removeCouponCode(couponCode: string): Promise<UserCart | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/c/remove`);
    const response = await apiRequest.postRequest<UserCart>({ couponCode });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    } else {
      return response;
    }
  }

  async updateCouponActiveStatus(
    couponId: string,
    isActive: boolean
  ): Promise<CouponClass | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/status/${couponId}`);

    const response = await apiRequest.patchRequest<CouponClass>({ isActive });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async addCoupon(
    fields: AddEditCouponFields
  ): Promise<CouponClass | ApiError> {
    const apiRequest = new ApiRequest(this.BASE_URL);

    const response = await apiRequest.postRequest<CouponClass>({
      name: fields.name,
      couponCode: fields.couponCode,
      type: COUPON_TYPES.FLAT,
      discountValue: fields.discountValue,
      minimumCartValue: fields.minimumCartValue,
      expiryDate: getMomentObjectFromDateObject(fields.expiryDate).format(
        DATE_TIME_FORMATS.standardDateWithTime
      ),
      startDate: getMomentObjectFromDateObject(fields.startDate).format(
        DATE_TIME_FORMATS.standardDateWithTime
      ),
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async editCoupon(
    fields: AddEditCouponFields,
    couponId: string
  ): Promise<CouponClass | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${couponId}`);

    const response = await apiRequest.patchRequest<CouponClass>({
      name: fields.name,
      couponCode: fields.couponCode,
      discountValue: fields.discountValue,
    });

    if (response instanceof ApiResponse && response.success) {
      return response.data;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }

  async deleteCoupon(couponId: string): Promise<CouponClass | ApiError> {
    const apiRequest = new ApiRequest(`${this.BASE_URL}/${couponId}`);

    const response = await apiRequest.deleteRequest<{
      deletedCoupon: CouponClass;
    }>();

    if (response instanceof ApiResponse && response.success) {
      return response.data.deletedCoupon;
    } else if (response instanceof ApiResponse) {
      return new ApiError(response.message);
    }
    return response;
  }
}

export default new CouponService();
