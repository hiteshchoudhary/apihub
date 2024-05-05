import { body, param } from "express-validator";

const updateProfileValidator = () => {
  return [
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is required")
      .optional(),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 15, min: 5 })
      .withMessage("Username must minimum of 5 and maximum of 15 characters")
      .optional(),
  ];
};

const usernameParamValidator = () => {
  return [
    param("username").trim().notEmpty().withMessage("Username is required"),
  ];
};

export { usernameParamValidator, updateProfileValidator };
