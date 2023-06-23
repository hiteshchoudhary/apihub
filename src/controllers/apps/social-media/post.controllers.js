import mongoose from "mongoose";
import { SocialPost } from "../../../models/apps/social-media/post.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getLocalPath, getStaticFilePath } from "../../../utils/helpers.js";
import { ApiError } from "../../../utils/ApiError.js";

/**
 * @description Utility function which returns the pipeline stages to structure the social post schema with calculations like, likes count, comments count, isLiked, isBookmarked etc
 * @returns {mongoose.PipelineStage[]}
 */
const postCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "sociallikes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "sociallikes",
        localField: "author",
        foreignField: "likedBy",
        as: "isLiked",
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
          { $addFields: { account: { $first: "$account" } } },
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
  ];
};

const createPost = asyncHandler(async (req, res) => {
  const { content, tags } = req.body;
  // Check if user has uploaded any images if yes then extract the file path
  // else assign an empty array
  /**
   * @type {{ url: string; localPath: string; }[]}
   */
  const images =
    req.files.images && req.files.images?.length
      ? req.files.images.map((image) => {
          const imageUrl = getStaticFilePath(req, image.filename);
          const imageLocalPath = getLocalPath(image.filename);
          return { url: imageUrl, localPath: imageLocalPath };
        })
      : [];

  const author = req.user._id;

  const post = await SocialPost.create({
    content,
    tags: tags || [],
    author,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await SocialPost.aggregate([...postCommonAggregation()]);

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await SocialPost.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    ...postCommonAggregation(),
  ]);

  if (!post[0]) {
    throw new ApiError(404, "Post does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post[0], "Post fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await SocialPost.findOneAndDelete({
    _id: postId,
    author: req.user._id,
  });

  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getAllPosts, getPostById, deletePost };
