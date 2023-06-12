import { Router } from "express";
import {
  getARandomCat,
  getCatById,
  getCats,
} from "../../controllers/public/cat.controllers.js";

const router = Router();

router.route("/").get(getCats);
router.route("/:catId").get(getCatById);
router.route("/cat/random").get(getARandomCat);

export default router;
