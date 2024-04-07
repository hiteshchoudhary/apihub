import quotesJson from "../../json/quotes.json" assert { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getQuotes = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let quotesArray = query
    ? structuredClone(quotesJson).filter((quote) => {
        return (
          quote.content.toLowerCase().includes(query) ||
          quote.author?.includes(query)
        );
      })
    : structuredClone(quotesJson);

  if (inc && inc[0]?.trim()) {
    quotesArray = filterObjectKeys(inc, quotesArray);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(quotesArray, page, limit),
        "Quotes fetched successfully"
      )
    );
});

const getQuoteById = asyncHandler(async (req, res) => {
  const { quoteId } = req.params;
  const quote = quotesJson.find((quote) => +quote.id === +quoteId);
  if (!quote) {
    throw new ApiError(404, "Quote does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, quote, "Quote fetched successfully"));
});

const getARandomQuote = asyncHandler(async (req, res) => {
  const quotesArray = quotesJson;
  const randomIndex = Math.floor(Math.random() * quotesArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        quotesArray[randomIndex],
        "Quote fetched successfully"
      )
    );
});

export { getQuotes, getARandomQuote, getQuoteById };
