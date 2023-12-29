import { Router } from "express";
import { randomuserController } from "../../controllers/public/index.js";

const router = Router();

router.route("/").get(randomuserController.getRandomUsers);
router.route("/:userId").get(randomuserController.getUserById);
router.route("/user/random").get(randomuserController.getARandomUser);

export default router;
