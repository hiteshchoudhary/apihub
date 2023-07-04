import mongoose from "mongoose";
import { SocialComment } from "../../../models/apps/social-media/comment.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";
import { ApiError } from "../../../utils/ApiError.js";

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const comment = await SocialComment.create({
    content,
    author: req.user?._id,
    postId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const commentAggregation = SocialComment.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "sociallikes",
        localField: "_id",
        foreignField: "commentId",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "sociallikes",
        localField: "_id",
        foreignField: "commentId",
        as: "isLiked",
        pipeline: [
          {
            $match: {
              likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "socialprofiles",
        localField: "author",
        foreignField: "owner",
        as: "author",
        pipeline: [
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
                    email: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              account: 1,
            },
          },
          {
            $addFields: {
              account: { $first: "$account" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: "$author" },
        likes: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: {
              $gte: [
                {
                  // if the isLiked key has document in it
                  $size: "$isLiked",
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
  ]);

  const comments = await SocialComment.aggregatePaginate(
    commentAggregation,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalComments",
        docs: "comments",
      },
    })
  );
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Post comments fetched successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const deletedComment = await SocialComment.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(commentId),
    author: req.user?._id,
  });

  if (!deletedComment) {
    throw new ApiError(
      404,
      "Comment is already deleted or you are not authorized for this action."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedComment }, "Comment deleted successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const updatedComment = await SocialComment.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(commentId),
      author: req.user?._id,
    },
    {
      $set: { content },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(
      404,
      "Comment does not exist or you are not authorized for this action."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

export { addComment, getPostComments, deleteComment, updateComment };
