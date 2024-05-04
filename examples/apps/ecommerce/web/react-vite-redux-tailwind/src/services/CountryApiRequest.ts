import { AxiosResponse } from "axios";
import { axiosCountryApi } from "../main";
import { countryApiAsyncHandler } from "../utils/countryApiAsyncHandler";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import { CountryApiResponse } from "./countryapi/CountryApiTypes";

class CountryApiRequest {
  constructor(public url: string) {}

  async getRequest<T>(
    queryParams: object = {},
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await countryApiAsyncHandler<T>(
      (): Promise<AxiosResponse<CountryApiResponse<T>>> =>
        axiosCountryApi.get<CountryApiResponse<T>>(this.url, {
          params: queryParams,
          headers: headers,
        })
    );
  }

  async postRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await countryApiAsyncHandler<T>(
      (): Promise<AxiosResponse<CountryApiResponse<T>>> =>
        axiosCountryApi.post<CountryApiResponse<T>>(this.url, body, {
          headers: headers,
        })
    );
  }

  async putRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await countryApiAsyncHandler(
      (): Promise<AxiosResponse<CountryApiResponse<T>>> =>
        axiosCountryApi.put<CountryApiResponse<T>>(this.url, body, {
          headers: headers,
        })
    );
  }

  async deleteRequest<T>(
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await countryApiAsyncHandler(
      (): Promise<AxiosResponse<CountryApiResponse<T>>> =>
        axiosCountryApi.delete<CountryApiResponse<T>>(this.url, {
          headers: headers,
        })
    );
  }

  async patchRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await countryApiAsyncHandler(
      (): Promise<AxiosResponse<CountryApiResponse<T>>> =>
        axiosCountryApi.patch<CountryApiResponse<T>>(this.url, body, {
          headers: headers,
        })
    );
  }
}

export default CountryApiRequest;
