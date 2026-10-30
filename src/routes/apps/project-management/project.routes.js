import { Router } from "express";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  removeProjectMember,
  updateProject,
  updateProjectMemberRole,
} from "../../../controllers/apps/project-management/project.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  addProjectMemberValidator,
  createProjectValidator,
  getAllProjectsQueryValidators,
  updateProjectMemberRoleValidator,
  updateProjectValidator,
} from "../../../validators/apps/project-management/project.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT); // Protect all project management routes

router
  .route("/")
  .post(createProjectValidator(), validate, createProject)
  .get(getAllProjectsQueryValidators(), validate, getAllProjects);

router
  .route("/:projectId")
  .get(mongoIdPathVariableValidator("projectId"), validate, getProjectById)
  .patch(
    mongoIdPathVariableValidator("projectId"),
    updateProjectValidator(),
    validate,
    updateProject
  )
  .delete(
    mongoIdPathVariableValidator("projectId"),
    validate,
    deleteProject
  );

router
  .route("/:projectId/members")
  .post(
    mongoIdPathVariableValidator("projectId"),
    addProjectMemberValidator(),
    validate,
    addProjectMember
  );

router
  .route("/:projectId/members/:memberId")
  .patch(
    mongoIdPathVariableValidator("projectId"),
    mongoIdPathVariableValidator("memberId"),
    updateProjectMemberRoleValidator(),
    validate,
    updateProjectMemberRole
  )
  .delete(
    mongoIdPathVariableValidator("projectId"),
    mongoIdPathVariableValidator("memberId"),
    validate,
    removeProjectMember
  );

export default router;
