import { query } from "express-validator";

const cookieKeyQueryStringValidator = () => {
  return [
    query("cookieKey")
      .trim()
      .notEmpty()
      .withMessage("cookieKey query is required"),
  ];
};

export { cookieKeyQueryStringValidator };
