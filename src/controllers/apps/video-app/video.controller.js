import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../../../models/apps/auth/user.models.js";
import { Video } from "../../../models/apps/video-app/video.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteAssetsOnCloudinary,
} from "../../../utils/Cloudinary.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

/**

* Uploads a video with the given title and description.

* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @returns {Object} - The response object containing the uploaded video data.
* @throws {ApiError} - If the title and description are not provided, or if the video and thumbnail files are not provided.
* @throws {ApiError} - If there is an error uploading the video or creating the video record.
*/
const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!(title && description)) {
      throw new ApiError(400, "title and description is required!");
    }
    if (!(req.files.videoFile && req.files.thumbnail)) {
      throw new ApiError(400, "videoFile and thumbnail is required!");
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
      .json(new ApiResponse(200, uploadVideo, "Upload Video SuccessFully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**

* Updates the details of a video.

* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @returns {Object} - The updated video details.
* @throws {ApiError} - If there is an error updating the video details.
*/
const changeVideoDetails = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, isForKids, isRestrict, isPublished } = req.body;

    if (!(title || description)) {
      throw new ApiError(400, "title or description field is required!");
    }

    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      throw new ApiError(404, "video is not exits");
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
      .json(new ApiResponse(200, updateVideo, "video updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Change the uploaded video file for a specific video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the video file is updated successfully.
 * @throws {ApiError} - If the video file is not provided, the video does not exist, or there is an error updating the video.
 */
const changeUploadVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }
    if (!req.file) {
      throw new ApiError(400, "video file is required!");
    }

    const videoLocalPath = req.file.path;

    const exitsVideo = await Video.findOne({ _id: videoId });

    if (!exitsVideo) {
      throw new ApiError(404, "video is not exits");
    }
    await deleteAssetsOnCloudinary({
      publicId: exitsVideo.videoFile[0].publicId,
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
        new ApiResponse(200, updateVideo, "video file updated successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Change the upload thumbnail for a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the thumbnail is updated.
 * @throws {ApiError} - If the thumbnail file is missing, the video does not exist, or the update fails.
 */

const changeUploadThumbnail = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!req.file) {
      throw new ApiError(400, "thumbnail file is required!");
    }

    const thumbnailLocalPath = req.file.path;

    const exitsVideo = await Video.findOne({ _id: videoId });

    if (!exitsVideo) {
      throw new ApiError(404, "video is not exits");
    }

    await deleteAssetsOnCloudinary({
      publicId: exitsVideo.thumbnail[0].publicId,
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
        new ApiResponse(
          200,
          updateVideo,
          "thumbnail file is update successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Get user video by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to nothing.
 * @throws {ApiError} - If the video is not found or an internal server error occurs.
 */
const getUserVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      throw new ApiError(404, "video is not exits");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "video fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

/**
 * Deletes a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a success message.
 * @throws {ApiError} If the video does not exist or if there is a server error.
 */

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }
    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      throw new ApiError(404, "video does not exits");
    }

    await deleteAssetsOnCloudinary({
      publicId: video.videoFile[0].publicId,
      fileType: "video",
    });

    await deleteAssetsOnCloudinary({
      publicId: video.thumbnail[0].publicId,
      fileType: "image",
    });

    await Video.deleteOne({ _id: videoId });
    return res
      .status(200)
      .json(new ApiResponse(200, "video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Watch a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the video is watched successfully.
 * @throws {ApiError} - If there is an error while watching the video.
 */
const watchVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!videoId) {
      throw new ApiError(400, "missing video id!");
    }

    const video = await Video.findById({ _id: videoId });

    if (!video) {
      throw new ApiError(404, "video is not exits");
    }

    const user = await User.findOne({
      _id: req.user._id,
    }).select("watchHistory");

    if (user) {
      const watchedVideo = user.watchHistory.filter(
        (video) => video.toHexString() === videoId
      );
      if (watchedVideo && watchedVideo.length !== 0) {
        throw new ApiError(400, "video is already watched");
      }
    }
    video.views += 1;

    await User.updateOne(
      { _id: req.user._id },
      { $push: { watchHistory: video._id } }
    );

    await video.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, "Video watched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Toggles the publish status of a video.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the updated video's publish status.
 * @throws {ApiError} - If the video id is missing or the video does not exist.
 */
const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!videoId) {
      throw new ApiError(400, "missing video id!");
    }

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
          "toggle publish status updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves all videos based on the provided query parameters.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the fetched videos.
 */
const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, query, sortBy, sortType, userId } = req.query;

    const allVideosAggregate = Video.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
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
    ]);

    let videosAggregate = allVideosAggregate;

    // If userId is provided, filter videos by owner
    if (userId || sortBy) {
      if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid Id");
      }
      const existUser = await User.findById({ _id: userId });

      if (!existUser) {
        throw new ApiError(404, "user is not found");
      }

      const userVideosAggregate = Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(existUser._id),
          },
        },
        {
          $sort: {
            createdAt: sortBy === "asc" ? 1 : -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
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
      ]);

      videosAggregate = userVideosAggregate;
    }

    // If query is provided, search videos by text
    if (query) {
      const searchByTextAggregateVideos = Video.aggregate([
        {
          $match: {
            $text: {
              $search: query,
            },
          },
        },
      ]);
      videosAggregate = searchByTextAggregateVideos;
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
            from: "users",
            localField: "owner",
            foreignField: "_id",
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

    // Fetch videos using aggregate pagination
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

    if (!videos) {
      throw new ApiError(404, "video is not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "all videos fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export {
  uploadVideo,
  getUserVideoById,
  deleteVideo,
  changeVideoDetails,
  changeUploadVideo,
  changeUploadThumbnail,
  watchVideo,
  togglePublishStatus,
  getAllVideos,
};
