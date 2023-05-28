import { User } from "../../../models/apps/auth/user.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // TODO: setup validator middleware or logic to handle data validation
  const { email, username, password } = req.body;
  const user = await User.create({ email, password, username });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, token }, "Users registered successfully")
    );
});

export { registerUser };
