import moviesJson from "../../json/movies-series/movies.json" assert { type: "json" };
import { getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getMovies = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const paginatedMovies = getPaginatedPayload(moviesJson, page, limit);
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

const getMovieById = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const movie = moviesJson.find((movie) => +movie.id === +movieId);
  if (!movie) {
    throw new ApiError(404, "Movie does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Movie fetched successfully"));
});

export { getMovies, getMovieById };
