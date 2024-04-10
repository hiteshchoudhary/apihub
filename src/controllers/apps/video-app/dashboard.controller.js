import mongoose from "mongoose";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { Video } from "../../../models/apps/video-app/video.model.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

/**
 * Retrieves the channel statistics for the authenticated user's channel.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The channel statistics.
 * @throws {ApiError} - If there is an error retrieving the channel statistics.
 */
const getChannelStats = asyncHandler(async (req, res) => {
  try {
    const channelDashboardStats = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "owner",
          foreignField: "channel",
          as: "totalSubscribers",
        },
      },
      {
        $addFields: {
          likes: {
            $size: "$likes",
          },
          totalSubscribers: {
            $size: "$totalSubscribers",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: "$views",
          },
          totalVideos: {
            $sum: 1,
          },
          totalLikes: {
            $sum: "$likes",
          },
          totalSubscribers: {
            $sum: "$totalSubscribers",
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelDashboardStats,
          "Get the channel stats info fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves the videos uploaded by the channel.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the fetched videos.
 * @throws {ApiError} - If there is an error while fetching the videos.
 */
const getChannelVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const videoUploadByChannel = Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
        },
      },
    ]);

    const videos = await Video.aggregatePaginate(
      videoUploadByChannel,
      getMongoosePaginationOptions({
        page,
        limit,
        customLabels: {
          docs: "channelVideos",
          totalDocs: "totalVideos",
        },
      })
    );

    if (!videos) {
      throw new ApiError(404, "no found video");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videos,
          "Get the channel upload video fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { getChannelStats, getChannelVideos };
