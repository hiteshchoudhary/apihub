import mongoose from "mongoose";
import { Playlist } from "../../../models/apps/video-app/playlist.models.js";
import { Video } from "../../../models/apps/video-app/video.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const createPlaylist = await Playlist.create({
    owner: req.user._id,
    name,
    description,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, createPlaylist, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const channelPlaylistsAggregate = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "videoappprofiles",
              localField: "owner",
              foreignField: "owner",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    coverImage: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$owner",
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        videos: 1,
        createdAt: 1,
      },
    },
  ]);

  if (channelPlaylistsAggregate.length === 0) {
    throw new ApiError(404, "No playlist found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelPlaylistsAggregate,
        "Channel playlists fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById({ _id: playlistId });

  if (!playlist) {
    throw new ApiError(404, "No playlist found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Channel playlist fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const isExistVideo = await Video.findOne({ _id: videoId });

  if (!isExistVideo) {
    throw new ApiError(404, "Video does not exist");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist does not exist");
  }

  if (playlist) {
    const isExistPlaylistVideo = playlist.videos.includes(videoId);

    if (isExistPlaylistVideo) {
      throw new ApiError(400, "Video already added to playlist");
    }
  }

  // Add the video to the playlist
  playlist.videos.push(videoId);

  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video saved to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const isExistVideo = await Video.findOne({ _id: videoId });

  if (!isExistVideo) {
    throw new ApiError(404, "Video does not exist");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    { _id: playlistId },
    {
      $pull: {
        videos: isExistVideo._id,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playList = await Playlist.findByIdAndDelete({
    _id: playlistId,
  });

  if (!playList) {
    throw new ApiError(400, "playlist does not exits");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const playlist = await Playlist.findByIdAndUpdate(
    {
      _id: playlistId,
    },
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(400, "playlist does not exits");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist updated successfully"));
});

export {
  updatePlaylist,
  deletePlaylist,
  getPlaylistById,
  createPlaylist,
  addVideoToPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
};
