import { isValidObjectId } from "mongoose";
import { Playlist } from "../../../models/apps/video-app/playlist.model.js";
import { Video } from "../../../models/apps/video-app/video.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

/**
 * Create a playlist.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with the created playlist.
 * @throws {ApiError} If name and description are not provided in the request body.
 * @throws {ApiError} If there is a server error while creating the playlist.
 */
const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!(name && description)) {
      throw new ApiError(400, "name and description is required!");
    }

    const createPlaylist = await Playlist.create({
      owner: req.user._id,
      name,
      description,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, createPlaylist, "playlist created successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves the playlists owned by a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the user playlists.
 * @throws {ApiError} - If no playlist is found.
 */

const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const userPlaylists = await Playlist.find({
      owner: userId,
    });

    if (userPlaylists.length === 0) {
      throw new ApiError(404, "No playlist found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userPlaylists,
          "user playlists fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const playlists = await Playlist.findById({ _id: playlistId });

    if (!playlists) {
      throw new ApiError(404, "No playlist found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlists, "user playlists fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
* Adds a video to a playlist.

* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @returns {Object} - The response object with the updated playlist.
* @throws {ApiError} - If the video or playlist does not exist.
*/
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!(isValidObjectId(playlistId) && isValidObjectId(videoId))) {
      throw new ApiError(400, "Invalid Id");
    }

    const existVideo = await Video.findOne({ _id: videoId });

    if (!existVideo) {
      throw new ApiError(404, "The video does not exist");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "The playlist does not exist");
    }

    if (playlist) {
      const isVideoExist = playlist.videos.includes(videoId);

      if (isVideoExist) {
        throw new ApiError(400, "The video already exist in the playlist");
      }
    }

    // Add the video to the playlist
    playlist.videos.push(videoId);

    // Save the updated playlist
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "video added to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!(isValidObjectId(playlistId) && isValidObjectId(videoId))) {
      throw new ApiError(400, "Invalid Id");
    }

    const existVideo = await Video.findOne({ _id: videoId });

    if (!existVideo) {
      throw new ApiError(404, "The video does not exist");
    }

    const playlist = await Playlist.findByIdAndUpdate(
      { _id: playlistId },
      {
        $pull: {
          videos: existVideo._id,
        },
      },
      {
        new: true, //return the updated document rather than the original one
      }
    );

    if (!playlist) {
      throw new ApiError(404, "The playlist does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "video removed to playlist successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const playList = await Playlist.findByIdAndDelete({
      _id: playlistId,
    });

    if (!playList) {
      throw new ApiError(400, "playlist does not exits");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid Id");
    }

    if (!(name && description)) {
      throw new ApiError(400, "name or description values is missing!");
    }

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
  } catch (error) {
    throw new ApiError(500, error.message);
  }
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
