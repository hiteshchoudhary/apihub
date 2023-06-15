import { body } from "express-validator";

const updateEcomProfileValidator = () => {
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

export { updateEcomProfileValidator };
