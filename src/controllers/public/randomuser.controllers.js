import randomUsersJson from "../../json/randomuser.json" assert { type: "json" };
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRandomUsers = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  const allUsers = randomUsersJson;

  const startPosition = +(page - 1) * limit;

  const randomUsersArray = [...randomUsersJson].slice(
    startPosition,
    startPosition + limit
  );

  const payload = {
    previousPage:
      page > 1
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page - 1
          }&limit=${limit}`
        : null,
    currentPage: `${req.protocol + "://" + req.get("host") + req.originalUrl}`,
    nextPage:
      [...randomUsersArray].pop()?.id < allUsers.length
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page + 1
          }&limit=${limit}`
        : null,
    users: randomUsersArray,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Random users fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = randomUsersJson.find((user) => +user.id === +userId);
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const getARandomUser = asyncHandler(async (req, res) => {
  const randomUsersArray = randomUsersJson;
  const randomIndex = Math.floor(Math.random() * randomUsersArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        randomUsersArray[randomIndex],
        "Random user fetched successfully"
      )
    );
});

export { getRandomUsers, getARandomUser, getUserById };
