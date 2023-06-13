import { Router } from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  removeCoupon,
  updateCoupon,
} from "../../../controllers/apps/ecommerce/coupon.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  applyCouponCodeValidator,
  couponPathVariableValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../../../validators/ecommerce/coupon.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/apply").post(applyCouponCodeValidator(), validate, applyCoupon);
router.route("/remove").post(removeCoupon);

router.use(isAdmin);

router
  .route("/")
  .get(getAllCoupons)
  .post(createCouponValidator(), validate, createCoupon);

router
  .route("/:couponId")
  .get(couponPathVariableValidator(), validate, getCouponById)
  .patch(
    couponPathVariableValidator(),
    updateCouponValidator(),
    validate,
    updateCoupon
  )
  .delete(couponPathVariableValidator(), validate, deleteCoupon);

export default router;
