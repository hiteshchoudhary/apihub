import { Router } from "express";
import { requestinspectionController } from "../../controllers/kitchen-sink/index.js";

const router = Router();

router.route("/headers").get(requestinspectionController.getRequestHeaders);
router.route("/ip").get(requestinspectionController.getClientIP);
router.route("/user-agent").get(requestinspectionController.getUserAgent);
router
  .route("/path-variable/:pathVariable")
  .get(requestinspectionController.getPathVariables);
router
  .route("/query-parameter")
  .get(requestinspectionController.getQueryParameters);

export default router;
