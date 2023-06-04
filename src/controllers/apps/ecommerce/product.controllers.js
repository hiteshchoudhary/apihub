import mongoose from "mongoose";
import { Product } from "../../../models/apps/ecommerce/product.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getStaticFilePath, removeImageFile } from "../../../utils/helpers.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock } = req.body;

  // Check if user has uploaded a main image
  if (!req.files?.mainImage || !req.files?.mainImage.length) {
    throw new ApiError(400, "Main image is required");
  }

  const mainImage = getStaticFilePath(req, req.files?.mainImage[0]?.filename);

  // Check if user has uploaded any subImages if yes then extract the file path
  // else assign an empty array
  const subImages =
    req.files.subImages && req.files.subImages?.length
      ? req.files.subImages.map((image) => {
          const imagePath = getStaticFilePath(req, image.filename);
          return imagePath;
        })
      : [];

  const owner = req.user._id;

  const product = await Product.create({
    name,
    description,
    stock,
    price,
    owner,
    mainImage,
    subImages,
    category,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const products = await Product.aggregate([
    {
      // match the products with provided category
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
    // group the products array based on category so that we get products key with array of products
    // and we can do a lookup for category to send category name as well in the response
    {
      $group: {
        _id: "$category",
        products: {
          $push: "$$ROOT", // push the whole ROOT which is an individual project object into the `products` array
        },
      },
    },
    {
      // Do a lookup for category to get the name
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "lookedUpCategory",
        pipeline: [
          {
            // Only project what is needed
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        category: { $first: "$lookedUpCategory" },
        products: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Category products fetched successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOneAndDelete({
    _id: productId,
  });

  if (!product) {
    throw new ApiError(404, "Product does not exist");
  }

  const productImages = [product.mainImage, ...product.subImages];

  productImages.map((image) => {
    const fileArray = image.split("/");
    const filename = fileArray[fileArray.length - 1];
    // remove images associated with the product that is being deleted
    removeImageFile(`public/images/${filename}`);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProduct: product },
        "Product deleted successfully"
      )
    );
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  getProductsByCategory,
};
