import seriesJson from "../../json/movies-series/series.json" assert { type: "json" };
import { getPaginatedPayload, filterObjectKeys } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getSeries = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const withGenres = req.query.with_genres
    ? req.query.with_genres
        .split(",")
        .map((genre) => genre.trim().toLowerCase())
    : null; // filter by genres
  const inc = req.query.inc?.split(","); // fields to include
  let seriesArray = structuredClone(seriesJson);

  // Filter by search query (title or overview)
  if (query) {
    seriesArray = seriesArray.filter((serie) => {
      return (
        serie.overview?.toLowerCase().includes(query) ||
        serie.name?.toLowerCase().includes(query)
      );
    });
  }

  // Filter by genres
  if (withGenres) {
    seriesArray = seriesArray.filter((series) => {
      return series.genres.some((genre) =>
        withGenres.includes(genre.toString().toLowerCase())
      );
    });
  }

  const paginatedSeries = getPaginatedPayload(seriesArray, page, limit);
  const updatedSeries = inc
    ? filterObjectKeys(inc, paginatedSeries.data)
    : paginatedSeries.data;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...paginatedSeries, data: updatedSeries },
        "Series fetched successfully"
      )
    );
});

const getARandomSerie = asyncHandler(async (req, res) => {
  const seriesArray = seriesJson;
  const randomIndex = Math.floor(Math.random() * seriesArray.length);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        seriesArray[randomIndex],
        "Series fetched successfully"
      )
    );
});

const getSerieById = asyncHandler(async (req, res) => {
  const { seriesId } = req.params;
  const serie = seriesJson.find((serie) => +serie.id === +seriesId);
  if (!serie) {
    throw new ApiError(404, "Series does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, serie, "Series fetched successfully"));
});

export { getSeries, getSerieById, getARandomSerie };
