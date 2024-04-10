import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../../../models/apps/video-app/comment.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { Video } from "../../../models/apps/video-app/video.model.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

/**
 * Retrieves the comments for a specific video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the video comments.
 * @throws {ApiError} - If the video comments are not found.
 */
const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const { page = 1, limit = 10 } = req.query;

    const videosCommentAggregate = Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "comments",
          pipeline: [
            {
              $sort: {
                createdAt: -1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.owner",
          foreignField: "_id",
          as: "comments.owner",
        },
      },

      {
        $unwind: {
          path: "$comments.owner",
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          thumbnail: { $first: "$thumbnail" },
          videoFile: { $first: "$videoFile" },
          owner: { $first: "$owner" },
          views: { $first: "$views" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          comments: { $push: "$comments" },
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          videoFile: 1,
          owner: 1,
          views: 1,
          createdAt: 1,
          updatedAt: 1,
          comments: {
            _id: 1,
            content: 1,
            owner: {
              _id: 1,
              username: 1,
              email: 1,
              avatar: 1,
              fullname: 1,
            },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      },
    ]);

    const videos = await Video.aggregatePaginate(
      videosCommentAggregate,
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          docs: "videosComment",
          totalDocs: "totalVideosComment",
        },
      })
    );

    if (!videos) {
      throw new ApiError(404, "videos comments no found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, videos, "videos all comment fetched successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Add a comment to a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the added comment.
 * @throws {ApiError} - If the video is not found or the content is empty.
 */
const addComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const video = await Video.findById({ _id: videoId });

    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    if (!content) {
      throw new ApiError(400, "Content is required!");
    }

    const createComment = await Comment.create({
      content,
      video: videoId,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, createComment, "comment add to successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * update a comment to a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with the update comment.
 * @throws {ApiError} - If the video is not found or the content is empty.
 */

const updateComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!content) {
      throw new ApiError(400, "Content is required!");
    }

    const comment = await Comment.findByIdAndUpdate(
      {
        _id: commentId,
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

    if (!comment) {
      throw new ApiError(400, "comment does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "comment updated to successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Deletes a comment.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const comment = await Comment.findByIdAndDelete({
      _id: commentId,
    });

    if (!comment) {
      throw new ApiError(400, "comment does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "comment deleted to successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
