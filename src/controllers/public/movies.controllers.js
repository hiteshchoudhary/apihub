import moviesJson from "../../json/movies-series/movies.json" assert { type: "json" };
import { getPaginatedPayload, filterObjectKeys } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getMovies = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const withGenres = req.query.with_genres
    ? req.query.with_genres
        .split(",")
        .map((genre) => genre.trim().toLowerCase())
    : null; // filter by genres
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let moviesArray = structuredClone(moviesJson);

  // Filter by search query
  if (query) {
    moviesArray = moviesArray.filter((movie) => {
      return (
        movie.overview?.toLowerCase().includes(query) ||
        movie.title?.toLowerCase().includes(query)
      );
    });
  }

  // Filter by genres
  if (withGenres) {
    moviesArray = moviesArray.filter((movie) => {
      return movie.genre_ids.some((genre) =>
        withGenres.includes(genre.toString().toLowerCase())
      );
    });
  }

  const paginatedMovies = getPaginatedPayload(moviesArray, page, limit);
  const updatedMovies = inc
    ? filterObjectKeys(inc, paginatedMovies.data)
    : paginatedMovies.data;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...paginatedMovies,
        data: updatedMovies,
      },
      "Movies fetched successfully"
    )
  );
});

const getARandomMovie = asyncHandler(async (req, res) => {
  const movieArray = moviesJson;
  const randomIndex = Math.floor(Math.random() * movieArray.length);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        movieArray[randomIndex],
        "Movie fetched successfully"
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

export { getMovies, getMovieById, getARandomMovie };
