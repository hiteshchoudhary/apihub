import jwt from "jsonwebtoken";
import { User } from "../../../models/apps/auth/user.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
  }
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
    role: role || "USER",
  });

  // TODO: Add functionality to send email verification mail to user's email

  user.password = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Users registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  // TODO: Save the refresh token with the user model to only allow refresh token which is not used

  user.password = undefined;

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...options })
    .cookie("refreshToken", refreshToken, { ...options })
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Users registered successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    // TODO: Once refresh token save in user model done add check to see if incoming refresh token is associated with the user
    if (!user) {
      // 498: expired or otherwise invalid token.
      throw new ApiError(498, "Invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    // TODO: Save the refresh token with the user model to only allow refresh token which is not used
    // TODO: Once used remove/replace the token with the new token in user model

    return res
      .status(200)
      .cookie("accessToken", accessToken, { ...options })
      .cookie("refreshToken", newRefreshToken, { ...options })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    // 498: expired or otherwise invalid token.
    throw new ApiError(498, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, getCurrentUser, refreshAccessToken };
