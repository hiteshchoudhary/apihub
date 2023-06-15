import { Router } from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  getValidCouponsForCustomer,
  removeCouponFromCart,
  updateCoupon,
  updateCouponActiveStatus,
} from "../../../controllers/apps/ecommerce/coupon.controllers.js";
import {
  verifyPermission,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import {
  applyCouponCodeValidator,
  couponActivityStatusValidator,
  couponPathVariableValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../../../validators/apps/ecommerce/coupon.validators.js";
import { validate } from "../../../validators/validate.js";
import { UserRolesEnum } from "../../../constants.js";

const router = Router();

// * CUSTOMER ROUTES
router.use(verifyJWT);

router.route("/apply").post(applyCouponCodeValidator(), validate, applyCoupon);
router.route("/remove").post(removeCouponFromCart);
// get coupons that customer can apply based on coupons active status and customer's cart value
router.route("/customer/available").get(getValidCouponsForCustomer);

// * ADMIN ROUTES
router.use(verifyPermission([UserRolesEnum.ADMIN]));

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
