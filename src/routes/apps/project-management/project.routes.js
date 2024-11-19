import { Router } from "express";

import { validate } from "../../../validators/validate.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import {
  acceptInvitationValidator,
  addMemberValidator,
  createProjectValidator,
  removeMemberValidator,
  updateProjectValidator,
} from "../../../validators/apps/project-management/project.validators.js";
import {
  inviteMember,
  createProject,
  deleteProject,
  getMembers,
  getProject,
  getProjects,
  removeMember,
  updateProject,
  acceptInvitation,
} from "../../../controllers/apps/project-management/project.controllers.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getProjects)
  .post(verifyJWT, createProjectValidator, validate, createProject);

router
  .route("/member")
  .post(verifyJWT, addMemberValidator, validate, inviteMember)
  .delete(verifyJWT, removeMemberValidator, validate, removeMember)
  .patch(verifyJWT, acceptInvitationValidator, validate, acceptInvitation);

router
  .route("/member/:projectId")
  .get(
    verifyJWT,
    mongoIdPathVariableValidator("projectId"),
    validate,
    getMembers
  );

router
  .route("/:projectId")
  .get(
    verifyJWT,
    mongoIdPathVariableValidator("projectId"),
    validate,
    getProject
  )
  .patch(
    verifyJWT,
    mongoIdPathVariableValidator("projectId"),
    updateProjectValidator,
    validate,
    updateProject
  )
  .delete(
    verifyJWT,
    mongoIdPathVariableValidator("projectId"),
    validate,
    deleteProject
  );

export default router;
