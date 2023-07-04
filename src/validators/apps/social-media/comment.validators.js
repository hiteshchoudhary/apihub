import { body, param } from "express-validator";

const commentContentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ];
};

const commentPathVariableValidator = () => {
  return [
    param("commentId").notEmpty().isMongoId().withMessage("Invalid comment id"),
  ];
};

export { commentContentValidator, commentPathVariableValidator };
