import { Router } from "express";
import { productController } from "../../../controllers/apps/ecommerce/index.js";
import {
  verifyPermission,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../../../validators/apps/ecommerce/product.validators.js";
import { validate } from "../../../validators/validate.js";
import { MAXIMUM_SUB_IMAGE_COUNT, UserRolesEnum } from "../../../constants.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
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
    productController.createProduct
  );

router
  .route("/:productId")
  .get(
    mongoIdPathVariableValidator("productId"),
    validate,
    productController.getProductById
  )
  .patch(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
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
    mongoIdPathVariableValidator("productId"),
    updateProductValidator(),
    validate,
    productController.updateProduct
  )
  .delete(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("productId"),
    validate,
    productController.deleteProduct
  );

router
  .route("/category/:categoryId")
  .get(
    mongoIdPathVariableValidator("categoryId"),
    validate,
    productController.getProductsByCategory
  );

router
  .route("/remove/subimage/:productId/:subImageId")
  .patch(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("productId"),
    mongoIdPathVariableValidator("subImageId"),
    validate,
    productController.removeProductSubImage
  );

export default router;
