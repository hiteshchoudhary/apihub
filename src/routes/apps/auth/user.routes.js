import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  verifyEmail,
} from "../../../controllers/apps/auth/user.controllers.js";
import {
  userChangeCurrentPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
} from "../../../validators/auth/user.validators.js";
import { validate } from "../../../validators/validate.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";

const router = Router();

// Unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:verificationToken").post(verifyEmail);

// Secured routes
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
