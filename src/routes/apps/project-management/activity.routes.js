import { Router } from "express";
import { getProjectActivities } from "../../../controllers/apps/project-management/activity.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/project/:projectId")
  .get(
    mongoIdPathVariableValidator("projectId"),
    validate,
    getProjectActivities
  );

export default router;
