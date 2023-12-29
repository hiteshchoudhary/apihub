import { Router } from "express";
import { profileController } from "../../../controllers/apps/ecommerce/index.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { updateEcomProfileValidator } from "../../../validators/apps/ecommerce/profile.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(profileController.getMyEcomProfile)
  .patch(
    updateEcomProfileValidator(),
    validate,
    profileController.updateEcomProfile
  );

router.route("/my-orders").get(profileController.getMyOrders);

export default router;
