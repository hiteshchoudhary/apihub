import randomUsersJson from "../../json/randomuser.json" with { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRandomUsers = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let randomUsersArray = query
    ? structuredClone(randomUsersJson).filter((user) => {
        return (
          user.name.first.toLowerCase().includes(query) ||
          user.name.last.toLowerCase().includes(query) ||
          user.name.title.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
    : structuredClone(randomUsersJson);

  const paginatedUsers = getPaginatedPayload(randomUsersArray, page, limit);
  const updatedUsers = inc
    ? filterObjectKeys(inc, paginatedUsers.data)
    : paginatedUsers.data;
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...paginatedUsers,
        data: updatedUsers,
      },
      "Random users fetched successfully"
    )
  );
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
