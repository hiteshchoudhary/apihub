import { body, query } from "express-validator";
import {
  AvailableProjectMemberRoles,
  AvailableProjectPriorities,
  AvailableProjectStatuses,
} from "../../../constants.js";

const createProjectValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableProjectStatuses)
      .withMessage("Invalid project status"),
    body("priority")
      .optional()
      .isIn(AvailableProjectPriorities)
      .withMessage("Invalid project priority"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid start date format"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
  ];
};

const updateProjectValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Project name cannot be empty"),
    body("description").optional().trim(),
    body("status")
      .optional()
      .isIn(AvailableProjectStatuses)
      .withMessage("Invalid project status"),
    body("priority")
      .optional()
      .isIn(AvailableProjectPriorities)
      .withMessage("Invalid project priority"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid start date format"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
  ];
};

const addProjectMemberValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Valid user email is required"),
    body("role")
      .optional()
      .isIn(AvailableProjectMemberRoles)
      .withMessage("Invalid member role"),
  ];
};

const updateProjectMemberRoleValidator = () => {
  return [
    body("role")
      .trim()
      .notEmpty()
      .isIn(AvailableProjectMemberRoles)
      .withMessage("Invalid member role"),
  ];
};

const getAllProjectsQueryValidators = () => {
  return [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Limit must be >= 1"),
    query("status")
      .optional()
      .isIn(AvailableProjectStatuses)
      .withMessage("Invalid status filter"),
    query("priority")
      .optional()
      .isIn(AvailableProjectPriorities)
      .withMessage("Invalid priority filter"),
    query("search").optional().trim(),
  ];
};

export {
  createProjectValidator,
  updateProjectValidator,
  addProjectMemberValidator,
  updateProjectMemberRoleValidator,
  getAllProjectsQueryValidators,
};
