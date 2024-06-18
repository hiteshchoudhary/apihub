import mongoose from "mongoose";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { Video } from "../../../models/apps/video-app/video.models.js";
import { Subscription } from "../../../models/apps/video-app/subcription.models.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const totalSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: "$channel",
        totalSubscribers: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

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
      $addFields: {
        likesCount: { $size: "$likes" },
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
        totalLikes: { $sum: "$likesCount" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const dashboardStats = {
    totalVideos: channelDashboardStats[0]?.totalVideos || 0,
    totalLikes: channelDashboardStats[0]?.totalLikes || 0,
    totalViews: channelDashboardStats[0]?.totalViews || 0,
    totalSubscribers: totalSubscribers[0]?.totalSubscribers || 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardStats,
        "dashboard stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
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
    throw new ApiError(404, "video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
