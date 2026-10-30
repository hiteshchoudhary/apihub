import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getRandomJob,
  updateJob,
} from "../../../controllers/apps/jobs/job.controllers.js";

import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import {
  createJobValidator,
  updateJobValidator,
} from "../../../validators/apps/jobs/job.validators.js";

const router = Router();

router.route("/").get(getAllJobs);

router.route("/random").get(getRandomJob);

router
  .route("/:jobId")
  .get(mongoIdPathVariableValidator("jobId"), validate, getJobById);

router.use(verifyJWT);

router.route("/").post(createJobValidator(), validate, createJob);

router
  .route("/:jobId")
  .patch(
    mongoIdPathVariableValidator("jobId"),
    updateJobValidator(),
    validate,
    updateJob
  )
  .delete(mongoIdPathVariableValidator("jobId"), validate, deleteJob);

export default router;
