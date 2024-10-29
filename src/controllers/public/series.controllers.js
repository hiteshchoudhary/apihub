import seriesJson from "../../json/movies-series/series.json" assert { type: "json" };
import { getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getSeries = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const paginatedMovies = getPaginatedPayload(seriesJson, page, limit);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...paginatedMovies },
        "Movies fetched successfully"
      )
    );
});

const getSerieById = asyncHandler(async (req, res) => {
  const { seriesId } = req.params;
  const movie = seriesJson.find((movie) => +movie.id === +seriesId);
  if (!movie) {
    throw new ApiError(404, "Movie does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Movie fetched successfully"));
});

export { getSeries, getSerieById };
