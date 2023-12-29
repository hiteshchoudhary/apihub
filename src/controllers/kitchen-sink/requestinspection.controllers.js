import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getRequestHeaders = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { headers: req.headers }, "Request headers returned")
    );
});

export const getClientIP = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ip: req.socket.remoteAddress || req.socket.localAddress,
        ipv: req.socket.remoteFamily || req.socket.localFamily,
      },
      "IP information returned"
    )
  );
});

export const getUserAgent = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userAgent: req.headers["user-agent"] },
        "User agent returned"
      )
    );
});

export const getPathVariables = asyncHandler(async (req, res) => {
  const { pathVariable } = req.params;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { pathVariable },
        "Path variables caught successfully"
      )
    );
});

export const getQueryParameters = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.query, "Query parameters caught successfully")
    );
});
