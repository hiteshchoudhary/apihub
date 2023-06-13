import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
} from "../../../controllers/apps/ecommerce/coupon.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  couponPathVariableValidator,
  createCouponValidator,
} from "../../../validators/ecommerce/coupon.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);
router.use(isAdmin);

router
  .route("/")
  .get(getAllCoupons)
  .post(createCouponValidator(), validate, createCoupon);

router
  .route("/:couponId")
  .get(couponPathVariableValidator(), validate, getCouponById)
  .delete(couponPathVariableValidator(), validate, deleteCoupon);

export default router;
