import { body, query } from "express-validator";

const getAllTodosQueryValidators = () => {
  return [
    query("query").optional(),
    query("complete")
      .optional()
      .isBoolean({
        loose: true,
      })
      .withMessage("complete flag must be a boolean."),
  ];
};

const createTodoValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Todo title is required"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Todo title is required"),
  ];
};

const updateTodoValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Todo title is required"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Todo title is required"),
  ];
};


export {
  createTodoValidator,
  updateTodoValidator,
  getAllTodosQueryValidators,
};
