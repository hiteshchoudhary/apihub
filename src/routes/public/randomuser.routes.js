import { Router } from "express";
import {
  getARandomUser,
  getRandomUsers,
  getUserById,
} from "../../controllers/public/randomuser.controllers.js";

const router = Router();

router.route("/").get(getRandomUsers);
router.route("/:userId").get(getUserById);
router.route("/user/random").get(getARandomUser);

export default router;
