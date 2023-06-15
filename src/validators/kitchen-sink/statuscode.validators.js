import { param } from "express-validator";

const statusCodeValidator = () => {
  return [
    param("statusCode")
      .notEmpty()
      .isInt({ min: 100 })
      .withMessage("Invalid status code"),
  ];
};

export { statusCodeValidator };
