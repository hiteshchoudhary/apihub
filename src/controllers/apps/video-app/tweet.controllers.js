import mongoose from "mongoose";
import { Tweet } from "../../../models/apps/video-app/tweet.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { VideoAppProfile } from "../../../models/apps/video-app/profile.models.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const createTweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const isExitUser = await VideoAppProfile.findOne({ owner: userId });

  if (!isExitUser) {
    throw new ApiError(400, "User does not exist");
  }
  const userTweetsAggregate = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  const tweets = userTweetsAggregate;

  if (!tweets) {
    throw new ApiError(404, "Tweet does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndUpdate(
    {
      _id: tweetId,
    },
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );
  if (!tweet) {
    throw new ApiError(400, "Tweet does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndDelete({
    _id: tweetId,
  });

  if (!tweet) {
    throw new ApiError(400, "Tweet does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
