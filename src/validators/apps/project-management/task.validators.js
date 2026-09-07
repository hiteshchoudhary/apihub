import { body, query } from "express-validator";
import {
  AvailableTaskPriorities,
  AvailableTaskStatuses,
} from "../../../constants.js";

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Task title is required"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid task status"),
    body("priority")
      .optional()
      .isIn(AvailableTaskPriorities)
      .withMessage("Invalid task priority"),
    body("assignee")
      .optional()
      .isMongoId()
      .withMessage("Invalid assignee ID"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("labels")
      .optional()
      .isArray()
      .withMessage("Labels must be an array of strings"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Task title cannot be empty"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid task status"),
    body("priority")
      .optional()
      .isIn(AvailableTaskPriorities)
      .withMessage("Invalid task priority"),
    body("assignee")
      .optional()
      .isMongoId()
      .withMessage("Invalid assignee ID"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("labels")
      .optional()
      .isArray()
      .withMessage("Labels must be an array of strings"),
  ];
};

const updateTaskStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid task status"),
  ];
};

const getProjectTasksQueryValidators = () => {
  return [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be >= 1"),
    query("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid status filter"),
    query("priority")
      .optional()
      .isIn(AvailableTaskPriorities)
      .withMessage("Invalid priority filter"),
    query("search").optional().trim(),
  ];
};

export {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
  getProjectTasksQueryValidators,
};
