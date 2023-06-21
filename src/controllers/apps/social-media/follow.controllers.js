import { User } from "../../../models/apps/auth/user.models.js";
import { SocialFollow } from "../../../models/apps/social-media/follow.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const followUnFollowUser = asyncHandler(async (req, res) => {
  const { toBeFollowedUserId } = req.params;

  // See if user that is being followed exist
  const toBeFollowed = await User.findById(toBeFollowedUserId);

  if (!toBeFollowed) {
    throw new ApiError(404, "User does not exist");
  }

  // Check of the user who is being followed is not the one who is requesting
  if (toBeFollowedUserId.toString() === req.user._id.toString()) {
    throw new ApiError(422, "You cannot follow yourself");
  }

  // Check if logged user is already following the to be followed user
  const isAlreadyFollowing = await SocialFollow.findOne({
    followerId: req.user._id,
    followeeId: toBeFollowed._id,
  });

  if (isAlreadyFollowing) {
    // if yes, then unfollow the user by deleting the follow entry from the DB
    await SocialFollow.findOneAndDelete({
      followerId: req.user._id,
      followeeId: toBeFollowed._id,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          following: false,
        },
        "Un-followed successfully"
      )
    );
  } else {
    // if no, then create a follow entry
    await SocialFollow.create({
      followerId: req.user._id,
      followeeId: toBeFollowed._id,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          following: true,
        },
        "Followed successfully"
      )
    );
  }
});

export { followUnFollowUser };
