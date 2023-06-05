import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  removeProductSubImage,
  updateProduct,
} from "../../../controllers/apps/ecommerce/product.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { categoryPathVariableValidator } from "../../../validators/ecommerce/category.validators.js";
import {
  createProductValidator,
  productPathVariableValidator,
  subImagePathVariableValidator,
  updateProductValidator,
} from "../../../validators/ecommerce/product.validators.js";
import { validate } from "../../../validators/validate.js";
import { MAXIMUM_SUB_IMAGE_COUNT } from "../../../constants.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyJWT,
    isAdmin,
    // In product form we will received one main image file type
    // And max 4 sub images
    upload.fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
      {
        // frontend will send at max 4 `subImages` keys with file object which we will save in the backend
        name: "subImages",
        maxCount: MAXIMUM_SUB_IMAGE_COUNT, // maximum number of subImages is 4
      },
    ]),
    createProductValidator(),
    validate,
    createProduct
  );

router
  .route("/:productId")
  .get(productPathVariableValidator(), validate, getProductById)
  .patch(
    verifyJWT,
    isAdmin,
    upload.fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
      {
        name: "subImages",
        maxCount: MAXIMUM_SUB_IMAGE_COUNT, // maximum number of subImages is 4
      },
    ]),
    productPathVariableValidator(),
    updateProductValidator(),
    validate,
    updateProduct
  )
  .delete(
    verifyJWT,
    isAdmin,
    productPathVariableValidator(),
    validate,
    deleteProduct
  );

router
  .route("/category/:categoryId")
  .get(categoryPathVariableValidator(), validate, getProductsByCategory);

router
  .route("/remove/subimage/:productId/:subImageId")
  .patch(
    verifyJWT,
    isAdmin,
    productPathVariableValidator(),
    subImagePathVariableValidator(),
    validate,
    removeProductSubImage
  );

export default router;
