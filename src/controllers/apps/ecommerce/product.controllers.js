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

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOneAndDelete({
    _id: productId,
    owner: req.user._id,
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
export { getAllProducts, createProduct, deleteProduct };
