import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  getMyEcomProfile,
  getMyOrders,
  updateEcomProfile,
} from "../../../controllers/apps/ecommerce/profile.controllers.js";
import { updateEcomProfileValidator } from "../../../validators/ecommerce/profile.validators.js";
import { validate } from "../../../validators/validate.js";
import { EcomProfile } from "../../../models/apps/ecommerce/profile.models.js";

const router = Router();

router.use(verifyJWT);

// Check if user profile exists or not
// If not create one
// User model is used across the all services
router.use(async (req, _, next) => {
  const profile = await EcomProfile.findOne({
    owner: req.user._id,
  });
  if (!profile) {
    await EcomProfile.create({
      owner: req.user._id,
    });
  }
  next();
});

router
  .route("/")
  .get(getMyEcomProfile)
  .patch(updateEcomProfileValidator(), validate, updateEcomProfile);

router.route("/my-orders").get(getMyOrders);

export default router;
