import { Router } from "express";
import {
  getARandomDog,
  getDogById,
  getDogs,
} from "../../controllers/public/dog.controllers.js";

const router = Router();

router.route("/").get(getDogs);
router.route("/:dogId").get(getDogById);
router.route("/dog/random").get(getARandomDog);

export default router;
