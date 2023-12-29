import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// TODO: Add more request methods (low priority)

/**
 *
 * @param {import("express").Request} req
 */
const getRequestMethodPayload = (req) => {
  return {
    method: req.method,
    headers: req.headers,
    origin: req.socket.localAddress,
    url: req.protocol + "://" + req.headers.host + req.originalUrl,
  };
};

export const getRequest = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, getRequestMethodPayload(req), "GET request"));
});

export const postRequest = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, getRequestMethodPayload(req), "POST request"));
});

export const putRequest = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, getRequestMethodPayload(req), "PUT request"));
});

export const patchRequest = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, getRequestMethodPayload(req), "PATCH request"));
});

export const deleteRequest = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, getRequestMethodPayload(req), "DELETE request"));
});
