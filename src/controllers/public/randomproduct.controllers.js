import randomProductsJson from "../../json/randomproduct.json" assert { type: "json" };
import { filterObjectKeys, getPaginatedPayload } from "../../utils/helpers.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getRandomProducts = asyncHandler(async (req, res) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = req.query.query?.toLowerCase(); // search query
  const inc = req.query.inc?.split(","); // only include fields mentioned in this query

  let randomProductsArray = query
    ? structuredClone(randomProductsJson).filter((product) => {
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        );
      })
    : structuredClone(randomProductsJson);

  if (inc && inc[0]?.trim()) {
    randomProductsArray = filterObjectKeys(inc, randomProductsArray);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getPaginatedPayload(randomProductsArray, page, limit),
        "Random products fetched successfully"
      )
    );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = randomProductsJson.find(
    (product) => +product.id === +productId
  );
  if (!product) {
    throw new ApiError(404, "Product does not exist.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getARandomProduct = asyncHandler(async (req, res) => {
  const randomProductsArray = randomProductsJson;
  const randomIndex = Math.floor(Math.random() * randomProductsArray.length);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        randomProductsArray[randomIndex],
        "Random product fetched successfully"
      )
    );
});

export { getRandomProducts, getARandomProduct, getProductById };
