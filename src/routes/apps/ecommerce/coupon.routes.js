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
  createCouponValidator,
  updateCouponValidator,
} from "../../../validators/apps/ecommerce/coupon.validators.js";
import { validate } from "../../../validators/validate.js";
import { UserRolesEnum } from "../../../constants.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

// * CUSTOMER ROUTES
router.use(verifyJWT);

router
  .route("/c/apply")
  .post(applyCouponCodeValidator(), validate, applyCoupon);
router.route("/c/remove").post(removeCouponFromCart);
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
  .get(mongoIdPathVariableValidator("couponId"), validate, getCouponById)
  .patch(
    mongoIdPathVariableValidator("couponId"),
    updateCouponValidator(),
    validate,
    updateCoupon
  )
  .delete(mongoIdPathVariableValidator("couponId"), validate, deleteCoupon);

router
  .route("/status/:couponId")
  .patch(
    mongoIdPathVariableValidator("couponId"),
    couponActivityStatusValidator(),
    validate,
    updateCouponActiveStatus
  );

export default router;
