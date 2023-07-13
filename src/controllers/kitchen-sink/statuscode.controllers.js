import { asyncHandler } from "../../utils/asyncHandler.js";
import statusCodesJson from "../../json/status-codes.json" assert { type: "json" };
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

/**
 * @description status codes which are avoiding sending response due to their nature
 */
const CONFLICTING_STATUS_CODES = [100, 102, 103, 204, 205, 304];

const getStatusCode = asyncHandler(async (req, res) => {
  const { statusCode } = req.params;

  /** @type {{statusCode: number, statusMessage: string, description: string, category: string}} */
  const payload = statusCodesJson[statusCode];

  if (!payload) {
    throw new ApiError(404, "Invalid status code");
  }

  return res
    .status(
      // If the status codes are causing problem in sending response just send 200 OK response so that user can see the response
      CONFLICTING_STATUS_CODES.includes(payload.statusCode)
        ? 200
        : payload.statusCode
    )
    .json(
      new ApiResponse(
        payload.statusCode,
        { ...payload },
        `${payload.statusCode}: ${payload.statusMessage}`
      )
    );
});

const getAllStatusCodes = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, statusCodesJson, "Status codes fetched"));
});

export { getStatusCode, getAllStatusCodes };
