import { param } from "express-validator";

const setCacheControlHeaderValidator = () => {
  return [
    param("timeToLive")
      .notEmpty()
      .withMessage("Time to live is missing")
      .isNumeric()
      .withMessage("Time to live must be a number"),
    param("cacheResponseDirective")
      .notEmpty()
      .isIn(["public", "private"])
      .withMessage("Invalid cache directive"),
  ];
};

export { setCacheControlHeaderValidator };
