import booksJson from "../../json/books.json" assert { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getBooks = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let booksArray = query
    ? structuredClone(booksJson).filter((book) => {
        return (
          book.searchInfo?.textSnippet.toLowerCase().includes(query) ||
          book.volumeInfo.title?.includes(query) ||
          book.volumeInfo.subtitle?.includes(query)
        );
      })
    : structuredClone(booksJson);

  if (inc && inc[0]?.trim()) {
    booksArray = filterObjectKeys(inc, booksArray);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(booksArray, page, limit),
        "Books fetched successfully"
      )
    );
});

export const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const book = booksJson.find((book) => +book.id === +bookId);
  if (!book) {
    throw new ApiError(404, "Book does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});

export const getARandomBook = asyncHandler(async (req, res) => {
  const booksArray = booksJson;
  const randomIndex = Math.floor(Math.random() * booksArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(200, booksArray[randomIndex], "Book fetched successfully")
    );
});
