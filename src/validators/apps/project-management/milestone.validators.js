import { body } from "express-validator";
import { AvailableMilestoneStatuses } from "../../../constants.js";

const createMilestoneValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Milestone name is required"),
    body("description").optional().trim(),
    body("dueDate")
      .notEmpty()
      .isISO8601()
      .withMessage("Valid due date is required"),
    body("status")
      .optional()
      .isIn(AvailableMilestoneStatuses)
      .withMessage("Invalid milestone status"),
  ];
};

const updateMilestoneValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Milestone name cannot be empty"),
    body("description").optional().trim(),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("status")
      .optional()
      .isIn(AvailableMilestoneStatuses)
      .withMessage("Invalid milestone status"),
  ];
};

export { createMilestoneValidator, updateMilestoneValidator };
