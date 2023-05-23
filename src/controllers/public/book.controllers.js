import booksJson from "../../json/books.json" assert { type: "json" };
import { filterObjectKeys } from "../../utils/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getBooks = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  const allBooks = booksJson;

  const startPosition = +(page - 1) * limit;

  let booksArray = (
    query
      ? [...booksJson].filter((book) => {
          return (
            book.searchInfo?.textSnippet.toLowerCase().includes(query) ||
            book.volumeInfo.title?.includes(query) ||
            book.volumeInfo.subtitle?.includes(query)
          );
        })
      : [...booksJson]
  ).slice(startPosition, startPosition + limit);

  if (inc && inc[0]?.trim()) {
    booksArray = filterObjectKeys(inc, booksArray);
  }

  const payload = {
    previousPage:
      page > 1
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page - 1
          }&limit=${limit}&query=${query}`
        : null,
    currentPage: `${req.protocol + "://" + req.get("host") + req.originalUrl}`,
    nextPage:
      booksArray.length === limit && [...booksArray].pop()?.id < allBooks.length
        ? `${req.protocol + "://" + req.get("host") + req.baseUrl}?page=${
            page + 1
          }&limit=${limit}`
        : null,
    books: booksArray,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Books fetched successfully"));
});

const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const book = booksJson.find((book) => +book.id === +bookId);
  if (!book) {
    throw new ApiError(404, "Book does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book fetched successfully"));
});

const getARandomBook = asyncHandler(async (req, res) => {
  const booksArray = booksJson;
  const randomIndex = Math.floor(Math.random() * booksArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(200, booksArray[randomIndex], "Book fetched successfully")
    );
});

export { getBooks, getARandomBook, getBookById };
