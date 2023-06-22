import mongoose from "mongoose";
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

// TODO: Add isFollowing flag in the followers list. So frontend can show follow/unfollow button based on that flag in the user's follow list. ONLY IF USER IS SEEING HIS?HER OWN FOLLOWER'S LIST
// TODO: IMP: CREATE ECOM AND SOCIAL MEDIA PROFILES ON AUTH REGISTRATION TO AVOID MISSING PROFILES IN MODULES
const getFollowersListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const userId = user._id;

  const followersList = await SocialFollow.aggregate([
    {
      $match: {
        // When we are fetching the followers list we want to match the follow documents with followee as current user
        // Meaning, someone is FOLLOWING current user (followee)
        followeeId: new mongoose.Types.ObjectId(userId),
      },
    },
    // Now we have all the follow documents where current user is followee (who is being followed)
    {
      $lookup: {
        // Lookup for the followers (users which are following current users)
        from: "users",
        localField: "followerId",
        foreignField: "_id",
        as: "follower",
        pipeline: [
          {
            $lookup: {
              // lookup for the each user's profile
              from: "socialprofiles",
              localField: "_id",
              foreignField: "owner",
              as: "profile",
            },
          },
          { $addFields: { profile: { $first: "$profile" } } },
          {
            $project: {
              // only project necessary fields
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        follower: { $first: "$follower" },
      },
    },
    {
      $group: {
        // Now group the aggregation results by followee id (current user's id)
        _id: "$followeeId",
        // Push all the followers into an array with key `followers`
        followers: {
          $push: "$follower",
        },
      },
    },
    {
      $lookup: {
        // lookup for the current user's profile
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $lookup: {
              from: "socialprofiles",
              localField: "_id",
              foreignField: "owner",
              as: "profile",
            },
          },
          { $addFields: { profile: { $first: "$profile" } } },
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, followersList, "Followers list fetched successfully")
    );
});

const getFollowingListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const userId = user._id;

  const followingList = await SocialFollow.aggregate([
    {
      $match: {
        // When we are fetching the following list we want to match the follow documents with follower as current user
        // Meaning, current user is FOLLOWING someone
        followerId: new mongoose.Types.ObjectId(userId),
      },
    },
    // Now we have all the follow documents where current user is a follower (who is following someone)
    {
      $lookup: {
        // Lookup for the followees (users which are being followed by the current user)
        from: "users",
        localField: "followeeId",
        foreignField: "_id",
        as: "following",
        pipeline: [
          {
            $lookup: {
              // lookup for the each user's profile
              from: "socialprofiles",
              localField: "_id",
              foreignField: "owner",
              as: "profile",
            },
          },
          { $addFields: { profile: { $first: "$profile" } } },
          {
            $project: {
              // only project necessary fields
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        following: { $first: "$following" },
      },
    },
    {
      $group: {
        // Now group the aggregation results by follower id (current user's id)
        _id: "$followerId",
        // Push all the profiles that current user is following into an array with key `following`
        following: {
          $push: "$following",
        },
      },
    },
    {
      $lookup: {
        // lookup for the current user's profile
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $lookup: {
              from: "socialprofiles",
              localField: "_id",
              foreignField: "owner",
              as: "profile",
            },
          },
          { $addFields: { profile: { $first: "$profile" } } },
          {
            $project: {
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, followingList, "Following list fetched successfully")
    );
});

export {
  followUnFollowUser,
  getFollowersListByUserName,
  getFollowingListByUserName,
};
