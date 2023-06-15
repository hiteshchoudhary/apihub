import { Router } from "express";
import { redirectToTheUrl } from "../../controllers/kitchen-sink/redirect.controllers.js";
import { redirectToTheUrlValidator } from "../../validators/kitchen-sink/redirect.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router
  .route("/to")
  .get(redirectToTheUrlValidator(), validate, redirectToTheUrl);

export default router;
