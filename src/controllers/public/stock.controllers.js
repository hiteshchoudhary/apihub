import nseStocksJson from "../../json/nse-stocks.json" with { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getStocks = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let stocksArray = query
    ? structuredClone(nseStocksJson).filter((stock) => {
        return (
          stock.Name?.toLowerCase()?.includes(query) ||
          stock.Symbol?.includes(query)
        );
      })
    : structuredClone(nseStocksJson);

  const paginatedStocks = getPaginatedPayload(stocksArray, page, limit);
  const updatedStocks = inc
    ? filterObjectKeys(inc, paginatedStocks.data)
    : paginatedStocks.data;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...paginatedStocks,
        data: updatedStocks,
      },
      "Stocks fetched successfully"
    )
  );
});

const getStockById = asyncHandler(async (req, res) => {
  const { stockSymbol } = req.params;
  const stock = nseStocksJson.find(
    (stock) => stock.Symbol.toLowerCase() === stockSymbol.toLowerCase()
  );
  if (!stock) {
    throw new ApiError(404, "Stock does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, stock, "Stock fetched successfully"));
});

const getARandomStock = asyncHandler(async (req, res) => {
  const stocksArray = nseStocksJson;
  const randomIndex = Math.floor(Math.random() * stocksArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stocksArray[randomIndex],
        "Stock fetched successfully"
      )
    );
});

export { getStocks, getARandomStock, getStockById };
