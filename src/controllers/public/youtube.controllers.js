import channelJson from "../../json/youtube/channel.json" assert { type: "json" };
import commentsJson from "../../json/youtube/comments.json" assert { type: "json" };
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

const getVideos = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  const videos = videosJson.channelVideos;

  let videosArray = query
    ? structuredClone(videos).filter((video) => {
        return (
          video.items.snippet.title.toLowerCase().includes(query) ||
          video.items.snippet.tags?.includes(query) ||
          video.items.snippet.description?.includes(query)
        );
      })
    : structuredClone(videos);

  if (inc && inc[0]?.trim()) {
    videosArray = filterObjectKeys(inc, videosArray);
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
    new ApiResponse(200, {
      channel,
      video,
    })
  );
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const comments = commentsJson[videoId];
  if (!comments) {
    throw new ApiError(404, "Video with ID " + videoId + " Does not exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments.items,
        "Video comments fetched successfully"
      )
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
  getRelatedVideos,
  getVideoById,
  getVideoComments,
  getVideos,
};
