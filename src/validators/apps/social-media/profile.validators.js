import { body, param } from "express-validator";

const updateSocialProfileValidator = () => {
  return [
    body("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name is required"),
    body("bio").optional().trim().notEmpty().withMessage("Bio is required"),
    body("dob")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Date of birth is required")
      .isISO8601()
      .withMessage("Invalid date of birth. Date must be in ISO8601 format"),
    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location is required"),
    body("phoneNumber")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isNumeric()
      .withMessage("Phone number is invalid.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number is invalid. It must be 10 digits long."),
    body("countryCode")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Country code is required")
      .isNumeric()
      .withMessage("Country code is invalid."),
  ];
};

const getProfileByUserNameValidator = () => {
  return [
    param("username").trim().notEmpty().withMessage("Username is required"),
  ];
};

export { updateSocialProfileValidator, getProfileByUserNameValidator };
