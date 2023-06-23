import mongoose from "mongoose";
import { SocialPost } from "../../../models/apps/social-media/post.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  getLocalPath,
  getStaticFilePath,
  removeImageFile,
} from "../../../utils/helpers.js";
import { ApiError } from "../../../utils/ApiError.js";
import { MAXIMUM_SOCIAL_POST_IMAGE_COUNT } from "../../../constants.js";

// TODO: implement like and unlike functionality in different controller and test the calculation implemented in postCommonAggregation utility func
// TODO: Add bookmark model and CRUD for the same
// TODO: include bookmark aggregation pipelines in postCommonAggregation function same as likes
// TODO: implement comments and add aggregation pipelines for the same in postCommonAggregation

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

  if (!post) {
    throw new ApiError(500, "Error while creating a post");
  }

  const createdPost = await SocialPost.aggregate([
    {
      $match: {
        _id: post._id,
      },
    },
    ...postCommonAggregation(),
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, createdPost[0], "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { content, tags } = req.body;
  const { postId } = req.params;
  const post = await SocialPost.findOne({
    _id: new mongoose.Types.ObjectId(postId),
    author: req.user?._id,
  });

  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  /**
   * @type {{ url: string; localPath: string; }[]}
   */
  let images =
    // If user has uploaded new images then we have to create an object with new url and local path in the array format
    req.files?.images && req.files.images?.length
      ? req.files.images.map((image) => {
          const imageUrl = getStaticFilePath(req, image.filename);
          const imageLocalPath = getLocalPath(image.filename);
          return { url: imageUrl, localPath: imageLocalPath };
        })
      : []; // if there are no new images uploaded we want to keep an empty array

  const existedImages = post.images.length; // total images already present in the post
  const newImages = images.length; // Newly uploaded images
  const totalImages = existedImages + newImages;

  if (totalImages > MAXIMUM_SOCIAL_POST_IMAGE_COUNT) {
    // We want user to only add at max 6 images
    // If the existing images + new images count exceeds 6
    // We want to throw an error

    // Before throwing an error we need to do some cleanup

    // remove the  newly uploaded images by multer as there is not updation happening
    images?.map((img) => removeImageFile(img.localPath));

    throw new ApiError(
      400,
      "Maximum " +
        MAXIMUM_SOCIAL_POST_IMAGE_COUNT +
        " images are allowed for a post. There are already " +
        existedImages +
        " images attached to the post."
    );
  }

  // If above checks are passed. We need to merge the existing images and newly uploaded images
  images = [...post.images, ...images];
  const updatedPost = await SocialPost.findByIdAndUpdate(
    postId,
    {
      $set: {
        content,
        tags,
        images,
      },
    },
    {
      new: true,
    }
  );

  const aggregatedPost = await SocialPost.aggregate([
    {
      $match: {
        _id: updatedPost._id,
      },
    },
    ...postCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, aggregatedPost[0], "Post updated successfully"));
});

const removePostImage = asyncHandler(async (req, res) => {
  const { postId, imageId } = req.params;

  const post = await SocialPost.findOne({
    _id: new mongoose.Types.ObjectId(postId),
    author: req.user?._id,
  });

  // check for post existence
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  const updatedPost = await SocialPost.findByIdAndUpdate(
    postId,
    {
      $pull: {
        // pull an item from images with _id equals to imageId
        images: {
          _id: new mongoose.Types.ObjectId(imageId),
        },
      },
    },
    { new: true }
  );

  // retrieve the file object which is being removed
  const removedImage = post.images?.find((image) => {
    return image._id.toString() === imageId;
  });

  if (removedImage) {
    // remove the file from file system as well
    removeImageFile(removedImage.localPath);
  }

  const aggregatedPost = await SocialPost.aggregate([
    {
      $match: {
        _id: updatedPost._id,
      },
    },
    ...postCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, aggregatedPost[0], "Post image removed successfully")
    );
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

  const postImages = [...(post.images || [])];

  postImages.map((image) => {
    // remove images associated with the post that is being deleted
    removeImageFile(image.localPath);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  removePostImage,
  deletePost,
};
