import { Router } from "express";
import passport from "passport";
import { UserRolesEnum } from "../../../constants.js";
import { userController } from "../../../controllers/apps/auth/index.js";

import {
  verifyJWT,
  verifyPermission,
} from "../../../middlewares/auth.middlewares.js";
import "../../../passport/index.js"; // import the passport config
import {
  userAssignRoleValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgottenPasswordValidator,
} from "../../../validators/apps/auth/user.validators.js";
import { validate } from "../../../validators/validate.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

// Unsecured route
router
  .route("/register")
  .post(userRegisterValidator(), validate, userController.registerUser);
router
  .route("/login")
  .post(userLoginValidator(), validate, userController.loginUser);
router.route("/refresh-token").post(userController.refreshAccessToken);
router
  .route("/verify-email/:verificationToken")
  .get(userController.verifyEmail);

router
  .route("/forgot-password")
  .post(
    userForgotPasswordValidator(),
    validate,
    userController.forgotPasswordRequest
  );
router
  .route("/reset-password/:resetToken")
  .post(
    userResetForgottenPasswordValidator(),
    validate,
    userController.resetForgottenPassword
  );

// Secured routes
router.route("/logout").post(verifyJWT, userController.logoutUser);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), userController.updateUserAvatar);
router.route("/current-user").get(verifyJWT, userController.getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    userController.changeCurrentPassword
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, userController.resendEmailVerification);
router
  .route("/assign-role/:userId")
  .post(
    verifyJWT,
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("userId"),
    userAssignRoleValidator(),
    validate,
    userController.assignRole
  );

// SSO routes
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to github...");
  }
);

router
  .route("/google/callback")
  .get(passport.authenticate("google"), userController.handleSocialLogin);

router
  .route("/github/callback")
  .get(passport.authenticate("github"), userController.handleSocialLogin);

export default router;
