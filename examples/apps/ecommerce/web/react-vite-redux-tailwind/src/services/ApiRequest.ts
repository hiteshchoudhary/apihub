import axios, { AxiosResponse } from "axios";
import { asyncHandler } from "../utils/asyncHandler";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";

class ApiRequest {
  constructor(public url: string) {}

  async getRequest<T>(
    queryParams: object = {},
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await asyncHandler<T>(
      (): Promise<AxiosResponse<ApiResponse<T>>> =>
        axios.get<ApiResponse<T>>(this.url, {
          params: queryParams,
          headers: headers,
        })
    );
  }

  async postRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await asyncHandler<T>(
      (): Promise<AxiosResponse<ApiResponse<T>>> =>
        axios.post<ApiResponse<T>>(this.url, body, { headers: headers })
    );
  }

  async putRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await asyncHandler(
      (): Promise<AxiosResponse<ApiResponse<T>>> =>
        axios.put<ApiResponse<T>>(this.url, body, { headers: headers })
    );
  }

  async deleteRequest<T>(
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await asyncHandler(
      (): Promise<AxiosResponse<ApiResponse<T>>> =>
        axios.delete<ApiResponse<T>>(this.url, { headers: headers })
    );
  }

  async patchRequest<T>(
    body: object,
    headers: object = {}
  ): Promise<ApiResponse<T> | ApiError> {
    return await asyncHandler(
      (): Promise<AxiosResponse<ApiResponse<T>>> =>
        axios.patch<ApiResponse<T>>(this.url, body, { headers: headers })
    );
  }
}

export default ApiRequest;
