import { body, param } from "express-validator";

const categoryRequestBodyValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Category name is required"),
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

export { categoryRequestBodyValidator, categoryPathVariableValidator };
