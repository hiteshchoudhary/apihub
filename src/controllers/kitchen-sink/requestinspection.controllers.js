import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRequestHeaders = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { headers: req.headers }, "Request headers returned")
    );
});

const getClientIP = asyncHandler(async (req, res) => {
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

const getUserAgent = asyncHandler(async (req, res) => {
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

export { getClientIP, getRequestHeaders, getUserAgent };
