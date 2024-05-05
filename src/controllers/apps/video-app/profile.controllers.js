import mongoose from "mongoose";
import { VideoAppProfile } from "../../../models/apps/video-app/profile.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../../utils/Cloudinary.js";

const updateVideoAppProfileDetails = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;

  const user = await VideoAppProfile.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        fullname,
        username,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successFully!"));
});

const updateVideoAppAvatarImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please attach your avatar file");
  }
  const avatarLocalFile = req?.file?.path;

  if (!avatarLocalFile) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFile);

  if (!avatar.url) {
    throw new ApiError(
      400,
      "something went wrong while uploading avatar image on cloudinary"
    );
  }

  const user = await VideoAppProfile.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateVideoAppCoverImage = asyncHandler(async (req, res) => {
  // Check if user has uploaded a cover image
  if (!req.file) {
    throw new ApiError(400, "Please attach your cover image file");
  }

  const coverImageLocalFile = req?.file?.path;

  if (!coverImageLocalFile) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalFile);

  if (!coverImage.url) {
    throw new ApiError(
      400,
      "something went wrong while uploading cover image on cloudinary"
    );
  }

  const user = await VideoAppProfile.findOneAndUpdate(
    {
      owner: req.user._id,
    },
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successFully"));
});

const getVideoAppChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const channel = await VideoAppProfile.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "Subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "SubscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$Subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$SubscribedTo",
        },
        isSubscribe: {
          $cond: {
            if: { $in: [req.user._id, "$Subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribe: 1,
        avatar: 1,
        coverImage: 1,
        owner: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, "Channel not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "Channel profile fetched successfully")
    );
});

const getVideoAppWatchHistory = asyncHandler(async (req, res) => {
  const watchHistoryAggregate = await VideoAppProfile.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $sort: {
              createdAt: 1,
            },
          },
          {
            $lookup: {
              from: "videoappprofiles",
              localField: "owner",
              foreignField: "owner",
              as: "owner",
              pipeline: [
                {
                  //* video owner info get
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    coverImage: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);

  const watchHistory = watchHistoryAggregate[0];

  return res
    .status(200)
    .json(
      new ApiResponse(200, watchHistory, "Watch history fetched successfully!")
    );
});

export {
  getVideoAppWatchHistory,
  updateVideoAppProfileDetails,
  updateVideoAppAvatarImage,
  updateVideoAppCoverImage,
  getVideoAppChannelProfile,
};
