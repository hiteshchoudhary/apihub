import { body } from "express-validator";

const addAExpenseValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Expense name is required"),
    body("Amount").trim().notEmpty().withMessage("Expense Amount is reuired"),
  ];
};

export { addAExpenseValidator };
