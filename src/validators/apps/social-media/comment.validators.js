import { body } from "express-validator";

const commentContentValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Comment content is required"),
  ];
};

export { commentContentValidator };
