import { body, param } from "express-validator";

const sendMessageValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

export { sendMessageValidator };
