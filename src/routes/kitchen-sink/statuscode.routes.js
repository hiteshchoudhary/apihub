import { Router } from "express";
import { getStatusCode } from "../../controllers/kitchen-sink/statuscode.controllers.js";
import { param } from "express-validator";
import { validate } from "../../validators/validate.js";

const router = Router();

router
  .route("/:statusCode")
  .get(
    [
      param("statusCode")
        .notEmpty()
        .isInt({ min: 100 })
        .withMessage("Invalid status code"),
    ],
    validate,
    getStatusCode
  );

export default router;
