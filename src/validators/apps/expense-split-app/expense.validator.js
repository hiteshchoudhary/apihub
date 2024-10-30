import { body } from "express-validator";

const addAnExpenseValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Expense name is required"),
    body("amount").trim().notEmpty().withMessage("Expense Amount is required"),
    body("participants")
      .isArray({
        min: 2,
        max: 100,
      })
      .withMessage("Participants must be an array with more than 2 members"),
  ];
};

export { addAnExpenseValidator };
