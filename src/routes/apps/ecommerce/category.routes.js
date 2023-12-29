import { Router } from "express";
import { categoryController } from "../../../controllers/apps/ecommerce/index.js";
import { categoryRequestBodyValidator } from "../../../validators/apps/ecommerce/category.validators.js";
import { validate } from "../../../validators/validate.js";
import {
  verifyPermission,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../../../constants.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    categoryRequestBodyValidator(),
    validate,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

router
  .route("/:categoryId")
  .get(
    mongoIdPathVariableValidator("categoryId"),
    validate,
    categoryController.getCategoryById
  )
  .delete(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    categoryController.deleteCategory
  )
  .patch(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    categoryRequestBodyValidator(),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    categoryController.updateCategory
  );

export default router;
