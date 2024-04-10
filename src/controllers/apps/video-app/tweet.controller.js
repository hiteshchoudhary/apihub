import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../../../models/apps/video-app/tweet.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { User } from "../../../models/apps/auth/user.models.js";

/**
 * Create a new tweet.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the tweet is created.
 */
const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Content is required!");
    }

    const createTweet = await Tweet.create({
      content,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, createTweet, "tweet add to successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves all tweets belonging to a specific user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the tweets are fetched successfully.
 * @throws {ApiError} - If the userId is missing or the user is not found.
 * @throws {ApiError} - If the user tweets cannot be fetched.
 */
const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const existUser = await User.findOne({ _id: userId });

    if (!existUser) {
      throw new ApiError(400, "user not found");
    }
    const userTweets = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);

    if (!userTweets) {
      throw new ApiError(404, "tweet does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, userTweets, "tweets fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Updates a tweet with the provided content.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the tweet is updated successfully.
 */
const updateTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!content) {
      throw new ApiError(400, "Content is required!");
    }

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
      throw new ApiError(400, "tweet does not exist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "tweet updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Deletes a tweet.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message.
 * @throws {ApiError} If unable to remove the tweet.
 */
const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const tweet = await Tweet.findByIdAndDelete({
      _id: tweetId,
    });

    if (!tweet) {
      throw new ApiError(400, "tweet does not exist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
