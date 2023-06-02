import { body, param } from "express-validator";

const createCategoryValidator = () => {
  return [body("name").notEmpty().withMessage("Category name is required")];
};

const updateCategoryValidator = () => {
  return [
    body("name").notEmpty().withMessage("Category name is required"),
    param("categoryId")
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid category id"),
  ];
};

const categoryPathVariableValidator = () => {
  return [
    param("categoryId")
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid category id"),
  ];
};

export {
  createCategoryValidator,
  updateCategoryValidator,
  categoryPathVariableValidator,
};
