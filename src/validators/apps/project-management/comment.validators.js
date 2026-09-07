import { body } from "express-validator";

const createCommentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ];
};

export { createCommentValidator };
