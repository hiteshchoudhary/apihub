import { body, param } from "express-validator";

const createPostValidator = () => {
  return [
    body("content").trim().notEmpty().withMessage("Post content is required"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags field must be an array"),
  ];
};

const postPathVariableValidator = () => {
  return [
    param("postId").notEmpty().isMongoId().withMessage("Invalid post id"),
  ];
};

export { createPostValidator, postPathVariableValidator };
