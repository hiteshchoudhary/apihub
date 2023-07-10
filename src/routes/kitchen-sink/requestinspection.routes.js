import { Router } from "express";
import {
  getClientIP,
  getPathVariables,
  getQueryParameters,
  getRequestHeaders,
  getUserAgent,
} from "../../controllers/kitchen-sink/requestinspection.controllers.js";

const router = Router();

router.route("/headers").get(getRequestHeaders);
router.route("/ip").get(getClientIP);
router.route("/user-agent").get(getUserAgent);
router.route("/path-variable/:pathVariable").get(getPathVariables);
router.route("/query-parameter").get(getQueryParameters);

export default router;
