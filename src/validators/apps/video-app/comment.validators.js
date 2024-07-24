import { body } from "express-validator";

const addCommentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("content is required")
      .isLength({ max: 200 })
      .withMessage("Content must be at most 200 characters long")
      .isString()
      .withMessage("Content must be a string"),
  ];
};

const updateCommentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required")
      .isString()
      .withMessage("Content must be a string")
      .optional(),
  ];
};

export { addCommentValidator, updateCommentValidator };
