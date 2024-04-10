import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../../../models/apps/video-app/comment.model.js";
import { Like } from "../../../models/apps/video-app/like.model.js";
import { Tweet } from "../../../models/apps/video-app/tweet.model.js";
import { Video } from "../../../models/apps/video-app/video.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

/**
 * Toggles the like status of a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the like status is toggled.
 * @throws {ApiError} - If there is an error while toggling the like status.
 */
const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const existVideo = await Video.findOne({ _id: videoId });

    if (!existVideo) {
      throw new ApiError(400, "video not found!");
    }
    // See if user has already liked the video
    const isAlreadyLiked = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });

    if (isAlreadyLiked) {
      //* if already liked, dislike it by removing the record from the DB
      await Like.findOneAndDelete({
        video: videoId,
        likedBy: userId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
          },
          "video disLiked successfully"
        )
      );
    } else {
      //* if not liked, like it by adding the record from the DB
      await Like.create({
        video: videoId,
        likedBy: userId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
          },
          "video Liked successfully"
        )
      );
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Toggles the like status of a video comment.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the like status is toggled.
 * @throws {ApiError} - If there is an error while toggling the like status.
 */

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const userId = req.user._id;

    const existComment = await Comment.findOne({ _id: commentId });

    if (!existComment) {
      throw new ApiError(400, "Comment not found!");
    }

    // See if user has already liked the comment
    const isAlreadyLiked = await Like.findOne({
      comment: commentId,
      likedBy: userId,
    });

    if (isAlreadyLiked) {
      // remove like on comment
      await Like.findOneAndDelete({
        comment: commentId,
        likedBy: userId,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
          },
          "comment disLiked successfully"
        )
      );
    } else {
      // add like on comment
      await Like.create({
        comment: commentId,
        likedBy: userId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
          },
          "comment liked successfully"
        )
      );
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Toggles the like status of a user tweet.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the like status is toggled.
 * @throws {ApiError} - If there is an error while toggling the like status.
 */

const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid Id");
    }
    const userId = req.user._id;

    const existTweet = await Tweet.findOne({ _id: tweetId });

    if (!existTweet) {
      throw new ApiError(400, "tweet not found!");
    }

    // See if user has already liked the tweet
    const isAlreadyLiked = await Like.findOne({
      tweet: tweetId,
      likedBy: userId,
    });

    if (isAlreadyLiked) {
      // remove like on tweet
      await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: userId,
      });

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
          },
          "tweet disLiked successfully"
        )
      );
    } else {
      // add like on tweet
      await Like.create({
        tweet: tweetId,
        likedBy: userId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
          },
          "tweet liked successfully"
        )
      );
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Retrieves the list of videos liked by the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the list of liked videos.
 */
const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const getUserAllLikedVideo = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "likedvideos",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $unwind: {
          path: "$likedvideos",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likedvideos.owner",
          foreignField: "_id",
          as: "likedvideos.owner",
          pipeline: [
            {
              $project: {
                userName: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$likedvideos.owner",
        },
      },
      {
        $group: {
          _id: null, // Grouping all results into one
          likedvideos: {
            $push: "$likedvideos",
          },
        },
      },
      {
        $project: {
          _id: 0,
          likedvideos: 1,
        },
      },
    ]);

    if (!getUserAllLikedVideo.length > 0) {
      throw new ApiError(404, "liked videos not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, getUserAllLikedVideo, "liked videos list"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
