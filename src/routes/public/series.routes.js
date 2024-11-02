import { Router } from "express";
import {
  getSeries,
  getSerieById,
  getARandomSerie,
} from "../../controllers/public/series.controllers.js";

const router = Router();

router.route("/").get(getSeries);
router.route("/:seriesId").get(getSerieById);
router.route("/series/random").get(getARandomSerie);

export default router;
