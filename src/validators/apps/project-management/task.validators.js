import { body } from "express-validator";

const projectIdValidator = [
  body("projectId")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Invalid project id"),
];

const taskIdValidator = [
  body("taskId")
    .notEmpty()
    .withMessage("Task id is required")
    .isMongoId()
    .withMessage("Invalid task id"),
];

const memberIdValidator = [
  body("memberId")
    .notEmpty()
    .withMessage("Member id is required")
    .isMongoId()
    .withMessage("Invalid member id"),
];

const taskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),

  body("status")
    .trim()
    .notEmpty()
    .isIn(["todo", "in_progress", "under_review", "completed"])
    .withMessage("Task status should be valid task status"),

  body("priority")
    .trim()
    .notEmpty()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority should be valid project priority"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date should be required.")
    .isISO8601()
    .toDate()
    .withMessage("Start date should be date type."),

  body("endDate")
    .notEmpty()
    .withMessage("End date should be required.")
    .isISO8601()
    .toDate()
    .withMessage("End date should be date type."),

  ...projectIdValidator,
];

const deleteTaskValidator = [...projectIdValidator, ...taskIdValidator];

const assignMemberToTaskValidator = [
  ...projectIdValidator,
  ...taskIdValidator,
  ...memberIdValidator,
];

export {
  taskValidator,
  projectIdValidator,
  taskIdValidator,
  deleteTaskValidator,
  assignMemberToTaskValidator,
};
