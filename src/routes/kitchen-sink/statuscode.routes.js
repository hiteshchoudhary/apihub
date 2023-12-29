import { Router } from "express";
import { statuscodeController } from "../../controllers/kitchen-sink/index.js";
import { statusCodeValidator } from "../../validators/kitchen-sink/statuscode.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router.route("/").get(statuscodeController.getAllStatusCodes);

router
  .route("/:statusCode")
  .get(statusCodeValidator(), validate, statuscodeController.getStatusCode);

export default router;
