import { Router } from "express";
import { redirectController } from "../../controllers/kitchen-sink/index.js";
import { redirectToTheUrlValidator } from "../../validators/kitchen-sink/redirect.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router
  .route("/to")
  .get(
    redirectToTheUrlValidator(),
    validate,
    redirectController.redirectToTheUrl
  );

export default router;
