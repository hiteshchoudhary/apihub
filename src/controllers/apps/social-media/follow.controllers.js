import mongoose from "mongoose";
import { User } from "../../../models/apps/auth/user.models.js";
import { SocialFollow } from "../../../models/apps/social-media/follow.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

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

const getFollowersListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const userAggregation = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        // lookup for the each user's profile
        from: "socialprofiles",
        localField: "_id",
        foreignField: "owner",
        as: "profile",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              bio: 1,
              location: 1,
              countryCode: 1,
              phoneNumber: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: { profile: { $first: "$profile" } },
    },
    {
      $project: {
        username: 1,
        email: 1,
        isEmailVerified: 1,
        avatar: 1,
        profile: 1,
      },
    },
  ]);

  const user = userAggregation[0];

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const userId = user._id;
  const followersAggregate = SocialFollow.aggregate([
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
          {
            // NOTE: In this logic we want to treat logged in user as a follower
            // LOGIC TO CHECK IF THE LOGGED IN USER IS FOLLOWING ANY OF THE FOLLOWERS
            // Point to be noted: There are chances that the logged in user is seeing someone else's follower list
            $lookup: {
              // We want to check if there is a document where follower is current logged in user and followee is the looked up user
              // If there is a document with above case that means logged in user is following the looked up user
              from: "socialfollows",
              localField: "_id", // ID of the looked up user
              foreignField: "followeeId",
              as: "isFollowing",
              pipeline: [
                {
                  $match: {
                    followerId: new mongoose.Types.ObjectId(req.user?._id), // Only get documents where logged in user is the follower
                  },
                },
              ],
            },
          },

          // Now we wither get no document (meaning, logged in user is not following anyone) or have the document where `LOOKED UP USER is the one who is BEING FOLLOWED BY THE CURRENT LOGGED IN USER`
          // So, if the document exist then the isFollowing flag should be true
          {
            $addFields: {
              profile: { $first: "$profile" },
              isFollowing: {
                $cond: {
                  if: {
                    $gte: [
                      {
                        // if the isFollowing key has document in it
                        $size: "$isFollowing",
                      },
                      1,
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              // only project necessary fields
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
              isFollowing: 1,
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
      $project: {
        _id: 0,
        follower: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$follower",
      },
    },
  ]);

  const followersList = await SocialFollow.aggregatePaginate(
    followersAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalFollowers",
        docs: "followers",
      },
    })
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, ...followersList },
        "Followers list fetched successfully"
      )
    );
});

const getFollowingListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const userAggregation = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        // lookup for the each user's profile
        from: "socialprofiles",
        localField: "_id",
        foreignField: "owner",
        as: "profile",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              bio: 1,
              location: 1,
              countryCode: 1,
              phoneNumber: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: { profile: { $first: "$profile" } },
    },
    {
      $project: {
        username: 1,
        email: 1,
        isEmailVerified: 1,
        avatar: 1,
        profile: 1,
      },
    },
  ]);

  const user = userAggregation[0];

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const userId = user._id;
  const followingAggregate = SocialFollow.aggregate([
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
          // NOTE: In this logic we want to treat logged in user as a follower
          // LOGIC TO CHECK IF THE LOGGED IN USER IS FOLLOWING ANY OF THE USERS THAT LOADED PROFILE USER FOLLOWING
          // Point to be noted: There are chances that the logged in user is seeing someone else's following list. SO if logged in user is seeing his own following list the isFollowing flag will be true
          {
            $lookup: {
              // We want to check if there is a document where follower is current logged in user and followee is the looked up user
              // If there is a document with above case that means logged in user is following the looked up user
              from: "socialfollows",
              localField: "_id",
              foreignField: "followeeId",
              as: "isFollowing",
              pipeline: [
                {
                  $match: {
                    followerId: new mongoose.Types.ObjectId(req.user?._id), // Only get documents where logged in user is the follower
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              profile: { $first: "$profile" },
              isFollowing: {
                $cond: {
                  if: {
                    $gte: [
                      {
                        $size: "$isFollowing",
                      },
                      1,
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              // only project necessary fields
              username: 1,
              email: 1,
              avatar: 1,
              profile: 1,
              isFollowing: 1,
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
      $project: {
        _id: 0,
        following: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$following",
      },
    },
  ]);

  const followingList = await SocialFollow.aggregatePaginate(
    followingAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalFollowing",
        docs: "following",
      },
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, ...followingList },
        "Following list fetched successfully"
      )
    );
});

export {
  followUnFollowUser,
  getFollowersListByUserName,
  getFollowingListByUserName,
};
