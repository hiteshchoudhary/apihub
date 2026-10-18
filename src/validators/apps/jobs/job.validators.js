import { body } from "express-validator";
import {
  AvailableEmploymentTypes,
  AvailableExperienceLevels,
  AvailableWorkModes,
} from "../../../constants.js";

const createJobValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Job title is required"),

    body("companyName")
      .trim()
      .notEmpty()
      .withMessage("Company name is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),

    body("salary").trim().notEmpty().withMessage("Salary is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),

    body("workMode")
      .optional()
      .isIn(AvailableWorkModes)
      .withMessage(
        `Invalid work mode. Must be one of: ${AvailableWorkModes.join(", ")}`
      ),

    body("employmentType")
      .optional()
      .isIn(AvailableEmploymentTypes)
      .withMessage(
        `Invalid employment type. Must be one of: ${AvailableEmploymentTypes.join(", ")}`
      ),

    body("experienceLevel")
      .optional()
      .isIn(AvailableExperienceLevels)
      .withMessage(
        `Invalid experience level. Must be one of: ${AvailableExperienceLevels.join(", ")}`
      ),

    body("requirements")
      .optional()
      .isArray()
      .withMessage("Requirements must be an array of strings"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),
  ];
};

const updateJobValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Job title cannot be empty"),

    body("companyName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Company name cannot be empty"),

    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location cannot be empty"),

    body("salary")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Salary cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("workMode")
      .optional()
      .isIn(AvailableWorkModes)
      .withMessage(
        `Invalid work mode. Must be one of: ${AvailableWorkModes.join(", ")}`
      ),

    body("employmentType")
      .optional()
      .isIn(AvailableEmploymentTypes)
      .withMessage(
        `Invalid employment type. Must be one of: ${AvailableEmploymentTypes.join(", ")}`
      ),

    body("experienceLevel")
      .optional()
      .isIn(AvailableExperienceLevels)
      .withMessage(
        `Invalid experience level. Must be one of: ${AvailableExperienceLevels.join(", ")}`
      ),

    body("requirements")
      .optional()
      .isArray()
      .withMessage("Requirements must be an array of strings"),

    body("tags")
      .optional()
      .isArray()
      .withMessage("Tags must be an array of strings"),
  ];
};

export { createJobValidator, updateJobValidator };
