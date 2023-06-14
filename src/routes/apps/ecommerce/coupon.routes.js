import { Router } from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  removeCouponFromCart,
  updateCoupon,
  updateCouponActiveStatus,
} from "../../../controllers/apps/ecommerce/coupon.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  applyCouponCodeValidator,
  couponActivityStatusValidator,
  couponPathVariableValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../../../validators/ecommerce/coupon.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/apply").post(applyCouponCodeValidator(), validate, applyCoupon);
router.route("/remove").post(removeCouponFromCart);

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

router
  .route("/status/:couponId")
  .patch(
    couponPathVariableValidator(),
    couponActivityStatusValidator(),
    validate,
    updateCouponActiveStatus
  );

export default router;
