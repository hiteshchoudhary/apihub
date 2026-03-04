import { Router } from "express";
import { generatePassword } from "../../controllers/public/password.controllers.js";

const router = Router();

router.route("/").get(generatePassword);

export default router;
