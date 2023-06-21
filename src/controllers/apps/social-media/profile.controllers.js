import { User } from "../../../models/apps/auth/user.models.js";
import { SocialProfile } from "../../../models/apps/social-media/profile.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  getLocalPath,
  getStaticFilePath,
  removeImageFile,
} from "../../../utils/helpers.js";

/**
 *
 * @param {string} userId
 * @description A utility function, which querys the {@link SocialProfile} model and returns the profile with account details
 */
const getUserSocialProfile = async (userId) => {
  const hasProfile = await SocialProfile.findOne({
    owner: userId,
  });

  if (!hasProfile) {
    await SocialProfile.create({
      owner: userId,
    });
  }

  let profile = await SocialProfile.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "account",
        pipeline: [
          {
            $project: {
              avatar: 1,
              role: 1,
              username: 1,
              email: 1,
              loginType: 1,
              isEmailVerified: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "socialfollows",
        localField: "owner",
        foreignField: "followerId",
        as: "following", // users that are followed by current user
      },
    },
    {
      $lookup: {
        from: "socialfollows",
        localField: "owner",
        foreignField: "followeeId",
        as: "followedBy", // users that are following the current user
      },
    },

    {
      $addFields: {
        account: { $first: "$account" },
        followersCount: { $size: "$followedBy" },
        followingCount: { $size: "$following" },
      },
    },
    {
      $project: {
        followedBy: 0,
        following: 0,
      },
    },
  ]);
  return profile[0];
};

const getMySocialProfile = asyncHandler(async (req, res) => {
  let profile = await getUserSocialProfile(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User profile fetched successfully"));
});

const getProfileByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const userProfile = await getUserSocialProfile(user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userProfile, "User profile fetched successfully")
    );
});

const updateSocialProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, countryCode, bio, dob, location } =
    req.body;

  let profile = await SocialProfile.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        firstName,
        lastName,
        phoneNumber,
        countryCode,
        bio,
        dob,
        location,
      },
    },
    { new: true }
  );

  profile = await getUserSocialProfile(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User profile updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  // Check if user has uploaded a cover image
  if (!req.file?.filename) {
    throw new ApiError(400, "Cover image is required");
  }
  // get cover image file's system url and local path
  const coverImageUrl = getStaticFilePath(req, req.file?.filename);
  const coverImageLocalPath = getLocalPath(req.file?.filename);

  const profile = await SocialProfile.findOne({
    owner: req.user._id,
  });

  let updatedProfile = await SocialProfile.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        // set the newly uploaded cover image
        coverImage: {
          url: coverImageUrl,
          localPath: coverImageLocalPath,
        },
      },
    },
    { new: true }
  );

  // remove the old cover image
  removeImageFile(profile.coverImage.localPath);

  updatedProfile = await getUserSocialProfile(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProfile, "Cover image updated successfully")
    );
});

export {
  getMySocialProfile,
  getProfileByUserName,
  updateSocialProfile,
  updateCoverImage,
};
