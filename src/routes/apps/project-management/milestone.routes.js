import { Router } from "express";
import {
  createMilestone,
  deleteMilestone,
  getMilestoneById,
  getProjectMilestones,
  updateMilestone,
} from "../../../controllers/apps/project-management/milestone.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createMilestoneValidator,
  updateMilestoneValidator,
} from "../../../validators/apps/project-management/milestone.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/project/:projectId")
  .post(
    mongoIdPathVariableValidator("projectId"),
    createMilestoneValidator(),
    validate,
    createMilestone
  )
  .get(
    mongoIdPathVariableValidator("projectId"),
    validate,
    getProjectMilestones
  );

router
  .route("/:milestoneId")
  .get(
    mongoIdPathVariableValidator("milestoneId"),
    validate,
    getMilestoneById
  )
  .patch(
    mongoIdPathVariableValidator("milestoneId"),
    updateMilestoneValidator(),
    validate,
    updateMilestone
  )
  .delete(
    mongoIdPathVariableValidator("milestoneId"),
    validate,
    deleteMilestone
  );

export default router;
