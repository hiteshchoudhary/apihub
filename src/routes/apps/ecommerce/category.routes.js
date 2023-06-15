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
  categoryPathVariableValidator,
} from "../../../validators/apps/ecommerce/category.validators.js";
import { validate } from "../../../validators/validate.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/")
  .post(
    verifyJWT,
    isAdmin,
    categoryRequestBodyValidator(),
    validate,
    createCategory
  )
  .get(getAllCategories);

router
  .route("/:categoryId")
  .get(categoryPathVariableValidator(), validate, getCategoryById)
  .delete(
    verifyJWT,
    isAdmin,
    categoryPathVariableValidator(),
    validate,
    deleteCategory
  )
  .patch(
    verifyJWT,
    isAdmin,
    categoryRequestBodyValidator(),
    categoryPathVariableValidator(),
    validate,
    updateCategory
  );

export default router;
