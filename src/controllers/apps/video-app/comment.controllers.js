import mongoose from "mongoose";
import { Comment } from "../../../models/apps/video-app/comment.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { Video } from "../../../models/apps/video-app/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videosCommentAggregate = await Video.aggregate([
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
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "videoappprofiles",
              localField: "owner",
              foreignField: "owner",
              as: "owner",
            },
          },
          {
            $unwind: {
              path: "$owner",
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              owner: {
                _id: 1,
                username: 1,
                fullname: 1,
                avatar: 1,
                coverImage: 1,
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
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
        comments: { $first: "$comments" },
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
        comments: 1,
      },
    },
  ]);

  const video = videosCommentAggregate[0];

  if (!video) {
    throw new ApiError(404, "video is not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "videos comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const createComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, createComment, "comment added to successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

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
    throw new ApiError(400, "comment does not exist!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated to successfully!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete({
    _id: commentId,
  });

  if (!comment) {
    throw new ApiError(400, "comment does not exist!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "comment deleted to successfully!"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
