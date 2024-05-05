import { body, query } from "express-validator";

const uploadVideoValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 1000 })
      .withMessage("Description must be at most 1000 characters long")
      .isString()
      .withMessage("Title must be a string"),
  ];
};

const changeVideoDetailsValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .optional()
      .isString()
      .withMessage("Title must be a string"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("isForKids")
      .optional()
      .isBoolean()
      .withMessage("isForKids must be a boolean"),
    body("isPublished")
      .optional()
      .isBoolean()
      .withMessage("isPublished must be a boolean"),
    body("isRestrict")
      .optional()
      .isBoolean()
      .withMessage("isRestrict must be a boolean"),
  ];
};

const getVideosValidator = () => {
  return [
    query("page").isInt().withMessage("Page must be an integer").optional(),
    query("limit").isInt().withMessage("Limit must be an integer").optional(),
    query("query").isString().withMessage("Query must be a string").optional(),
    query("sortType")
      .isString()
      .withMessage("SortType must be a string")
      .optional(),
    query("userId")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID")
      .optional(),
  ];
};

export {
  uploadVideoValidator,
  changeVideoDetailsValidator,
  getVideosValidator,
};
