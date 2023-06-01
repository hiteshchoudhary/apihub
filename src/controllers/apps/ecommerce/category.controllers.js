import { Category } from "../../../models/apps/ecommerce/category.models.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name, owner: req.user._id });

  return res
    .status(201)
    .json(new ApiResponse(200, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export { createCategory, getAllCategories };
