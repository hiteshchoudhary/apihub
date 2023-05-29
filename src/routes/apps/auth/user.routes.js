import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../../controllers/apps/auth/user.controllers.js";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../../../validators/auth/user.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);

export default router;
