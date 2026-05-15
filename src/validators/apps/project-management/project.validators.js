import { body } from "express-validator";

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("tags")
    .notEmpty()
    .withMessage("Tags is required")
    .isArray()
    .withMessage("Tags must be array"),
];

const updateProjectValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("tags")
    .notEmpty()
    .withMessage("Tags is required")
    .isArray()
    .withMessage("Tags must be array"),
];

const addMemberValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["owner", "admin", "member"])
    .withMessage("Role must be a valid role [owner, admin, member]"),
  body("projectId").notEmpty().isMongoId().withMessage(`Invalid project ID`),
];

const removeMemberValidator = [
  body("projectId").notEmpty().isMongoId().withMessage("Invalid project ID"),
  body("memberId").notEmpty().isMongoId().withMessage("Invalid member ID"),
];

const acceptInvitationValidator = [
  body("projectId").notEmpty().isMongoId().withMessage("Invalid project ID"),
  body("memberId").notEmpty().isMongoId().withMessage("Invalid member ID"),
];

export {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
  removeMemberValidator,
  acceptInvitationValidator,
};
