import catsJson from "../../json/cats.json" assert { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getCats = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let catsArray = query
    ? structuredClone(catsJson).filter((cat) => {
        return (
          cat.name?.toLowerCase().includes(query) ||
          cat.temperament?.toLowerCase().includes(query)
        );
      })
    : structuredClone(catsJson);

  if (inc && inc[0]?.trim()) {
    catsArray = filterObjectKeys(inc, catsArray);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(catsArray, page, limit),
        "Cats fetched successfully"
      )
    );
});

const getCatById = asyncHandler(async (req, res) => {
  const { catId } = req.params;
  const cat = catsJson.find((cat) => +cat.id === +catId);
  if (!cat) {
    throw new ApiError(404, "Cat does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, cat, "Cat fetched successfully"));
});

const getARandomCat = asyncHandler(async (req, res) => {
  const catsArray = catsJson;
  const randomIndex = Math.floor(Math.random() * catsArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(200, catsArray[randomIndex], "Cat fetched successfully")
    );
});

export { getCats, getARandomCat, getCatById };
