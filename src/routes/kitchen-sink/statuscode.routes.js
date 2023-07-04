import { Router } from "express";
import {
  getAllStatusCodes,
  getStatusCode,
} from "../../controllers/kitchen-sink/statuscode.controllers.js";
import { statusCodeValidator } from "../../validators/kitchen-sink/statuscode.validators.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router.route("/").get(getAllStatusCodes);

router
  .route("/:statusCode")
  .get(statusCodeValidator(), validate, getStatusCode);

export default router;
