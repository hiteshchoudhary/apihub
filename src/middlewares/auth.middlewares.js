import { User } from "../models/apps/auth/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  try {
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      // 498: expired or otherwise invalid token.
      throw new ApiError(498, "Invalid access token");
    }
    user.password = undefined;
    req.user = user;
    next();
  } catch (error) {
    // 498: expired or otherwise invalid token.
    throw new ApiError(498, error?.message || "Invalid access token");
  }
});
