import dogsJson from "../../json/dogs.json" with { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getDogs = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let dogsArray = query
    ? structuredClone(dogsJson).filter((dog) => {
        return (
          dog.name?.toLowerCase().includes(query) ||
          dog.breed_group?.toLowerCase().includes(query)
        );
      })
    : structuredClone(dogsJson);

  const paginatedDogs = getPaginatedPayload(dogsArray, page, limit);
  const updatedDogs = inc
    ? filterObjectKeys(inc, paginatedDogs.data)
    : paginatedDogs.data;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...paginatedDogs,
        data: updatedDogs,
      },
      "Dogs fetched successfully"
    )
  );
});

const getDogById = asyncHandler(async (req, res) => {
  const { dogId } = req.params;
  const dog = dogsJson.find((dog) => +dog.id === +dogId);
  if (!dog) {
    throw new ApiError(404, "Dog does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, dog, "Dog fetched successfully"));
});

const getARandomDog = asyncHandler(async (req, res) => {
  const dogsArray = dogsJson;
  const randomIndex = Math.floor(Math.random() * dogsArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(200, dogsArray[randomIndex], "Dog fetched successfully")
    );
});

export { getDogs, getARandomDog, getDogById };
