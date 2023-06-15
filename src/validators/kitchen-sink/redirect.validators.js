import { query } from "express-validator";

const redirectToTheUrlValidator = () => {
  return [
    query("url")
      .trim()
      .notEmpty()
      .withMessage("url is required")
      .isURL()
      .withMessage("URL passed in the query is invalid"),
  ];
};

export { redirectToTheUrlValidator };
