import { body } from "express-validator";
import { mongoIdRequestBodyValidator } from "../../common/mongodb.validators.js";

const createProductValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("stock")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Stock is required")
      .isNumeric()
      .withMessage("Stock must be a number"),
    ...mongoIdRequestBodyValidator("category")
  ];
};

const updateProductValidator = () => {
  return [
    body("name").optional().trim().notEmpty().withMessage("Name is required"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("price")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("stock")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Stock is required")
      .isNumeric()
      .withMessage("Stock must be a number"),
    ...mongoIdRequestBodyValidator("category")
  ];
};

export {
  createProductValidator,
  updateProductValidator,
};
