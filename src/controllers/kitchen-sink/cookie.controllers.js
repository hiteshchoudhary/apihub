import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getCookies = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { cookies: req.cookies }, "Cookies returned"));
});

export const setCookie = asyncHandler(async (req, res) => {
  const cookieObject = req.body;

  Object.entries(cookieObject).forEach((entry) => {
    res.cookie(...entry);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cookies: { ...req.cookies, ...cookieObject } },
        "Cookie has been set"
      )
    );
});

export const removeCookie = asyncHandler(async (req, res) => {
  const { cookieKey } = req.query;

  return res
    .status(200)
    .clearCookie(cookieKey)
    .json(
      new ApiResponse(
        200,
        { cookies: { ...req.cookies, [cookieKey]: undefined } },
        "Cookie has been cleared"
      )
    );
});
