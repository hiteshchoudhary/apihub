import { YouTubeFilterEnum, AvailableYouTubeFilters } from "../../constants.js";
import channelJson from "../../json/youtube/channel.json" assert { type: "json" };
import commentsJson from "../../json/youtube/comments.json" assert { type: "json" };
import playlistItemsJson from "../../json/youtube/playlistitems.json" assert { type: "json" };
import playlistsJson from "../../json/youtube/playlists.json" assert { type: "json" };
import videosJson from "../../json/youtube/videos.json" assert { type: "json" };
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";

const getChannelDetails = asyncHandler(async (req, res) => {
  const channelDetails = channelJson.channel;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelDetails,
        "Channel details fetched successfully!"
      )
    );
});

const getPlaylists = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  const playlists = playlistsJson;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(playlists, page, limit),
        "Playlists fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  // filter out the playlist by id from json array
  const playlist = playlistsJson.find((playlist) => playlist.id === playlistId);

  if (!playlist) {
    throw new ApiError(
      404,
      "Playlist with ID " + playlistId + " Does not exist"
    );
  }

  // get the channel info
  const channel = {
    info: channelJson.channel.info.snippet,
    statistics: channelJson.channel.info.statistics,
  };

  // Get the playlist items in the playlist
  const playlistItems = playlistItemsJson.filter(
    (item) => item.snippet.playlistId === playlistId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channel,
        playlist,
        playlistItems,
      },
      "Playlist fetched successfully"
    )
  );
});

const getVideos = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  /**
   * @type {AvailableYouTubeFilters[0]}
   */
  const sortBy = req.query.sortBy;

  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  const videos = videosJson.channelVideos;

  let videosArray = query
    ? structuredClone(videos).filter((video) => {
        return (
          // Search videos based on title, description and tags
          video.items.snippet.title.toLowerCase().includes(query) ||
          video.items.snippet.tags?.includes(query) ||
          video.items.snippet.description?.includes(query)
        );
      })
    : structuredClone(videos);

  if (inc && inc[0]?.trim()) {
    videosArray = filterObjectKeys(inc, videosArray);
  }

  switch (sortBy) {
    case YouTubeFilterEnum.LATEST:
      // sort by publishedAt key in descending order
      videosArray.sort(
        (a, b) =>
          new Date(b.items.snippet.publishedAt) -
          new Date(a.items.snippet.publishedAt)
      );
      break;
    case YouTubeFilterEnum.OLDEST:
      // sort by publishedAt key in ascending order
      videosArray.sort(
        (a, b) =>
          new Date(a.items.snippet.publishedAt) -
          new Date(b.items.snippet.publishedAt)
      );
      break;
    case YouTubeFilterEnum.MOST_LIKED:
      videosArray.sort(
        (a, b) => +b.items.statistics.likeCount - +a.items.statistics.likeCount
      );
      break;
    case YouTubeFilterEnum.MOST_VIEWED:
      videosArray.sort(
        (a, b) => +b.items.statistics.viewCount - +a.items.statistics.viewCount
      );
      break;
    default:
      // Return latest videos by default
      videosArray.sort(
        (a, b) =>
          new Date(b.items.snippet.publishedAt) -
          new Date(a.items.snippet.publishedAt)
      );
      break;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(videosArray, page, limit),
        "Videos fetched successfully"
      )
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // get filter based on id
  const video = videosJson.channelVideos.find(
    (video) => video.items.id === videoId
  );

  if (!video) {
    throw new ApiError(404, "Video with ID " + videoId + " Does not exist");
  }

  const channel = {
    info: channelJson.channel.info.snippet,
    statistics: channelJson.channel.info.statistics,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channel,
        video,
      },
      "Video fetched successfully"
    )
  );
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = videosJson.channelVideos.find(
    (video) => video.items.id === videoId
  );

  if (!video) {
    throw new ApiError(404, "Video with ID " + videoId + " Does not exist");
  }

  const comments = commentsJson[videoId]?.items || [];

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Video comments fetched successfully")
    );
});

const getRelatedVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  const video = videosJson.channelVideos.find(
    (video) => video.items.id === videoId
  );

  if (!video) {
    throw new ApiError(404, "Video with ID " + videoId + " Does not exist");
  }

  // related videos are all except the selected one
  const relatedVideos = videosJson.channelVideos.filter(
    (video) => video.items.id !== videoId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(relatedVideos, page, limit),
        "Related videos fetched successfully"
      )
    );
});

export {
  getChannelDetails,
  getPlaylistById,
  getPlaylists,
  getRelatedVideos,
  getVideoById,
  getVideoComments,
  getVideos,
};
