import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const ALLOWED_COOKIES = ["theme", "language", "preferences", "sessionId"];

const sanitizeCookieValue = (value) => {
  if (typeof value !== "string") return String(value);
  return value.replace(/[<>"'%;()&+]/g, "");
};

const validateAndPrepareCookie = (key, value) => {
  if (!ALLOWED_COOKIES.includes(key)) {
    return null;
  }
  const sanitizedValue = sanitizeCookieValue(value);
  return { key, value: sanitizedValue, options: { httpOnly: true, secure: true, sameSite: "strict" } };
};

const getCookies = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { cookies: req.cookies }, "Cookies returned"));
});

const setCookie = asyncHandler(async (req, res) => {
  const cookieObject = req.body;
  const validCookies = {};

  for (const [key, value] of Object.entries(cookieObject)) {
    const validated = validateAndPrepareCookie(key, value);
    if (validated) {
      res.cookie(validated.key, validated.value, validated.options);
      validCookies[key] = value;
    }
  }

  if (Object.keys(validCookies).length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No valid cookies provided"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cookies: { ...req.cookies, ...validCookies } },
        "Cookie has been set"
      )
    );
});

const removeCookie = asyncHandler(async (req, res) => {
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

export { getCookies, setCookie, removeCookie };
