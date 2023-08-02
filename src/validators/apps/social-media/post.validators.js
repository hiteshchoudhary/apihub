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

const updatePostValidator = () => {
  return [
    body("content")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Post content cannot be empty"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags field must be an array"),
  ];
};

const usernamePathVariableValidator = () => {
  return [
    param("username").toLowerCase().notEmpty().withMessage("Invalid username"),
  ];
};

const tagPathVariableValidator = () => {
  return [param("tag").notEmpty().withMessage("Tag is required")];
};

export {
  createPostValidator,
  updatePostValidator,
  usernamePathVariableValidator,
  tagPathVariableValidator,
};
