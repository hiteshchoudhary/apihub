import { body, check, param } from "express-validator";

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
    body("category").notEmpty().isMongoId().withMessage("Invalid category id"),
  ];
};

const productPathVariableValidator = () => {
  return [
    param("productId").notEmpty().isMongoId().withMessage("Invalid product id"),
  ];
};

export { productPathVariableValidator, createProductValidator };
