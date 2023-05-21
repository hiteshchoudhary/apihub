import { Router } from "express";
import {
  getARandomUser,
  getRandomUsers,
} from "../../controllers/public/randomuser.controllers.js";

const router = Router();

router.route("/").get(getRandomUsers);
router.route("/user").get(getARandomUser);

export default router;
