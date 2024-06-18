import mongoose from "mongoose";
import { VideoAppProfile } from "../../../models/apps/video-app/profile.models.js";
import { Video } from "../../../models/apps/video-app/video.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteAssetsOnCloudinary,
} from "../../../utils/Cloudinary.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(req.files.videoFile && req.files.thumbnail)) {
    throw new ApiError(400, "video file and thumbnail file is required!");
  }

  const videoLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const uploadVideo = await Video.create({
    title,
    description,
    videoFile: {
      url: videoFile.secure_url,
      publicId: videoFile.public_id,
    },
    thumbnail: {
      url: thumbnail.secure_url,
      publicId: thumbnail.public_id,
    },
    owner: req.user._id,
    duration: videoFile.duration,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, uploadVideo, "video uploaded successfully"));
});

const changeVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, isForKids, isRestrict, isPublished } = req.body;

  const isExitsVideo = await Video.findOne({ _id: videoId });

  if (!isExitsVideo) {
    throw new ApiError(404, "video is not exits!");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    { _id: videoId },
    {
      title,
      description,
      isForKids: isForKids || 0,
      isRestrict: isRestrict || 0,
      isPublished,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "video details updated successfully")
    );
});

const changeUploadVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "video file is required!");
  }

  const videoLocalPath = req.file.path;

  const isExitsVideo = await Video.findOne({ _id: videoId });

  if (!isExitsVideo) {
    throw new ApiError(404, "video is not exits!");
  }
  await deleteAssetsOnCloudinary({
    publicId: isExitsVideo.videoFile[0].publicId,
    fileType: "video",
  });

  const videoFile = await uploadOnCloudinary(videoLocalPath);

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        videoFile: {
          url: videoFile.secure_url,
          publicId: videoFile.public_id,
        },
        duration: videoFile.duration,
      },
    },
    {
      new: true,
    }
  ).select("videoFile duration");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "video file is update successfully")
    );
});

const changeUploadThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "thumbnail file is required!");
  }

  const thumbnailLocalPath = req.file.path;

  const isExitsVideo = await Video.findOne({ _id: videoId });

  if (!isExitsVideo) {
    throw new ApiError(404, "video is not exits!");
  }

  await deleteAssetsOnCloudinary({
    publicId: isExitsVideo.thumbnail[0].publicId,
    fileType: "image",
  });

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

  const updateVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: {
          url: thumbnailFile.secure_url,
          publicId: thumbnailFile.public_id,
        },
      },
    },
    {
      new: true,
    }
  ).select("thumbnail");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "thumbnail file is update successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const videoAggregate = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        duration: 1,
        description: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        title: 1,
        owner: 1,
        likes: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  const video = videoAggregate[0];

  if (!video) {
    throw new ApiError(404, "video is not exits");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const isExitsVideo = await Video.findOne({ _id: videoId });

  if (!isExitsVideo) {
    throw new ApiError(404, "video is not exits!");
  }

  await deleteAssetsOnCloudinary({
    publicId: isExitsVideo.videoFile[0].publicId,
    fileType: "video",
  });

  await deleteAssetsOnCloudinary({
    publicId: isExitsVideo.thumbnail[0].publicId,
    fileType: "image",
  });

  await Video.deleteOne({ _id: videoId });
  return res
    .status(200)
    .json(new ApiResponse(200, "video deleted successfully"));
});

const watchVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiError(404, "video is not exits");
  }

  const user = await VideoAppProfile.findOne({
    owner: req.user._id,
  }).select("watchHistory");

  if (user) {
    const watchedVideo = user.watchHistory.filter(
      (video) => video.toHexString() === videoId
    );
    if (watchedVideo && watchedVideo.length !== 0) {
      throw new ApiError(400, "video is already watched!");
    }
  }
  // increment video views
  video.views += 1;

  await VideoAppProfile.updateOne(
    { owner: req.user._id },
    { $push: { watchHistory: video._id } }
  );

  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "video watched successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const exitVideo = await Video.findById(videoId);

  if (!exitVideo) {
    throw new ApiError(404, "video does not exits");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    { _id: videoId },
    {
      $set: {
        isPublished: !exitVideo.isPublished,
      },
    },
    { new: true }
  ).select("isPublished");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateVideo,
        "video publish status updated successfully"
      )
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy, sortType, userId } = req.query;

  const allVideosAggregate = Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "videoappprofiles",
        localField: "owner",
        foreignField: "owner",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 0,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
  ]);

  let videosAggregate = allVideosAggregate;

  if (sortBy) {
    const sortVideosAggregate = Video.aggregate([
      {
        $match: {},
      },
      {
        $sort: {
          createdAt: sortBy === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "videoappprofiles",
          localField: "owner",
          foreignField: "owner",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 0,
                avatar: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
    ]);

    videosAggregate = sortVideosAggregate;
  }

  // If userId is provided, filter videos by owner
  if (userId) {
    const existUser = await VideoAppProfile.findOne({ owner: userId });

    if (!existUser) {
      throw new ApiError(404, "user is not found");
    }

    const userVideosAggregate = Video.aggregate([
      {
        $match: {
          owner: existUser.owner,
        },
      },
      {
        $sort: {
          createdAt: sortBy === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "videoappprofiles",
          localField: "owner",
          foreignField: "owner",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 0,
                avatar: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
    ]);

    videosAggregate = userVideosAggregate;
  }

  // If sortType is "uploadDate", sort videos by createdAt
  if (sortType == "uploadDate") {
    const sortVideosByUploadDateAggregate = Video.aggregate([
      {
        $sort: {
          createdAt: sortBy === "asc" ? 1 : -1,
        },
      },
      {
        $lookup: {
          from: "videoappprofiles",
          localField: "owner",
          foreignField: "owner",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 0,
                avatar: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
    ]);
    videosAggregate = sortVideosByUploadDateAggregate;
  }

  // If sortType is "viewCount", sort videos by views
  if (sortType == "viewCount") {
    const sortVideosByViewCountAggregate = Video.aggregate([
      {
        $sort: {
          views: sortBy === "asc" ? 1 : -1,
        },
      },
    ]);
    videosAggregate = sortVideosByViewCountAggregate;
  }

  const videos = await Video.aggregatePaginate(
    videosAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});

export {
  uploadVideo,
  getVideoById,
  deleteVideo,
  changeVideoDetails,
  changeUploadVideo,
  changeUploadThumbnail,
  watchVideo,
  togglePublishStatus,
  getAllVideos,
};
