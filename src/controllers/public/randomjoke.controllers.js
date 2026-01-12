import randomJokesJson from "../../json/randomjoke.json" with { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRandomJokes = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let randomJokesArray = query
    ? structuredClone(randomJokesJson).filter((joke) => {
        return joke.content.toLowerCase().includes(query);
      })
    : structuredClone(randomJokesJson);

  const paginatedJokes = getPaginatedPayload(randomJokesArray, page, limit);
  const updatedJokes = inc
    ? filterObjectKeys(inc, paginatedJokes.data)
    : paginatedJokes.data;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...paginatedJokes,
        data: updatedJokes,
      },
      "Random jokes fetched successfully"
    )
  );
});

const getJokeById = asyncHandler(async (req, res) => {
  const { jokeId } = req.params;
  const joke = randomJokesJson.find((joke) => +joke.id === +jokeId);
  if (!joke) {
    throw new ApiError(404, "Joke does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, joke, "Joke fetched successfully"));
});

const getARandomJoke = asyncHandler(async (req, res) => {
  const randomJokesArray = randomJokesJson;
  const randomIndex = Math.floor(Math.random() * randomJokesArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        randomJokesArray[randomIndex],
        "Random joke fetched successfully"
      )
    );
});

export { getRandomJokes, getARandomJoke, getJokeById };
