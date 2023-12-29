import { Router } from "express";
import { healthcheckController } from "../controllers/index.js";

const router = Router();

router.route("/").get(healthcheckController.healthcheck);

export default router;
