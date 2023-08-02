import { body, param } from "express-validator";

const categoryRequestBodyValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Category name is required"),
  ];
};

export { categoryRequestBodyValidator };
