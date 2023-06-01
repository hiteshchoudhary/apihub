import { body } from "express-validator";

const createCategoryValidator = () => {
  return [body("name").notEmpty().withMessage("Category name is required")];
};

export { createCategoryValidator };
