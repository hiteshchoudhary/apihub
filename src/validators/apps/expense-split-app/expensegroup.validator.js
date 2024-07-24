import { body } from "express-validator";

const createAExpenseGroupValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Group name is required"),
    body("participants")
      .isArray({
        min: 1,
        max: 100,
      })
      .withMessage("Participants must be an array with minimum 1 member"),
  ];
};

export { createAExpenseGroupValidator };
