import { Router } from "express";
import {
  getSeries,
  getSerieById,
} from "../../controllers/public/series.controllers.js";

const router = Router();

router.route("/").get(getSeries);
router.route("/:seriesId").get(getSerieById);

export default router;
