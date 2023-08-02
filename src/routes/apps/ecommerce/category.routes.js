import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../../controllers/apps/ecommerce/category.controllers.js";
import {
  categoryRequestBodyValidator,
} from "../../../validators/apps/ecommerce/category.validators.js";
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
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:categoryId")
  .get(mongoIdPathVariableValidator("categoryId"), validate, getCategoryById)
  .delete(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    deleteCategory
  )
  .patch(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    categoryRequestBodyValidator(),
    mongoIdPathVariableValidator("categoryId"),
    validate,
    updateCategory
  );

export default router;
