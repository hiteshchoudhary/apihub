import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from "../../../controllers/apps/ecommerce/product.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createProductValidator,
  productPathVariableValidator,
} from "../../../validators/ecommerce/product.validators.js";
import { validate } from "../../../validators/validate.js";
import { upload } from "../../../middlewares/multer.middlewares.js";

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
        name: "subImages",
        maxCount: 4, // maximum number of subImages is 4
      },
    ]),
    createProductValidator(),
    validate,
    createProduct
  );

router
  .route("/:productId")
  .delete(
    verifyJWT,
    isAdmin,
    productPathVariableValidator(),
    validate,
    deleteProduct
  );

export default router;
