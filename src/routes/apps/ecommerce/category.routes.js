import { Router } from "express";
import {
  createCategory,
  getAllCategories,
} from "../../../controllers/apps/ecommerce/category.controllers.js";
import { createCategoryValidator } from "../../../validators/ecommerce/category.validators.js";
import { validate } from "../../../validators/validate.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, isAdmin, createCategoryValidator(), validate, createCategory)
  .get(getAllCategories);

export default router;
