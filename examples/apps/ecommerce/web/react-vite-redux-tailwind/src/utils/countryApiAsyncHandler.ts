import { AxiosError, AxiosResponse } from "axios";
import {
  CountryApiErrorResponse,
  CountryApiResponse,
} from "../services/countryapi/CountryApiTypes";
import ApiResponse from "../services/ApiResponse";
import ApiError, { ApiErrorResponse } from "../services/ApiError";

export const countryApiAsyncHandler = async <T>(
  func: () => Promise<AxiosResponse<CountryApiResponse<T>>>
): Promise<ApiResponse<T> | ApiError> => {
  return Promise.resolve(func())
    .then((response) => {
      if (response.data.error) {
        return new ApiError(response.data.msg);
      } else {
        return new ApiResponse<T>(
          response.status,
          response.data.data,
          response.data.msg,
          true
        );
      }
    })
    .catch((error: AxiosError<CountryApiErrorResponse>) => {
      return new ApiError(
        error.message,
        error,
        new ApiErrorResponse(
          error.status || 400,
          error.response?.data.msg || error.message,
          [],
          ''
        )
      );
    });
};
