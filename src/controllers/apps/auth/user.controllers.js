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

  user.password = undefined;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Users registered successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, getCurrentUser };
