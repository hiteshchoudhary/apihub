import { body } from "express-validator";

const sendMessageValidator = () => {
  return [
    body("content")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("Content is required"),
  ];
};

export { sendMessageValidator };
