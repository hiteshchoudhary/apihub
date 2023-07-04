import { Router } from "express";
import {
  getClientIP,
  getRequestHeaders,
  getUserAgent,
} from "../../controllers/kitchen-sink/requestinspection.controllers.js";

const router = Router();

router.route("/headers").get(getRequestHeaders);
router.route("/ip").get(getClientIP);
router.route("/user-agent").get(getUserAgent);

export default router;
