import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../../../controllers/apps/auth/user.controllers.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../../../validators/auth/user.validators.js";
import { validate } from "../../../validators/validate.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
