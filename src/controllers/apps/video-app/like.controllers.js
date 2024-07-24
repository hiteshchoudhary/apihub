import mongoose from "mongoose";
import { Comment } from "../../../models/apps/video-app/comment.models.js";
import { Like } from "../../../models/apps/video-app/like.models.js";
import { Tweet } from "../../../models/apps/video-app/tweet.models.js";
import { Video } from "../../../models/apps/video-app/video.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const existVideo = await Video.findOne({ _id: videoId });

  if (!existVideo) {
    throw new ApiError(400, "video does not exist");
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
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const userId = req.user._id;

  const isExistComment = await Comment.findOne({ _id: commentId });

  if (!isExistComment) {
    throw new ApiError(400, "Comment does not exist!");
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
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const userId = req.user._id;

  const existTweet = await Tweet.findOne({ _id: tweetId });

  if (!existTweet) {
    throw new ApiError(400, "tweet does not exist");
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
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userLikedVideosAggregate = await Like.aggregate([
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
        from: "videoappprofiles",
        localField: "likedvideos.owner",
        foreignField: "owner",
        as: "likedvideos.owner",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              coverImage: 1,
              fullname: 1,
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

  const likedVideos = userLikedVideosAggregate[0];

  if (!likedVideos) {
    throw new ApiError(404, "No liked videos found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully!")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
