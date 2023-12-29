import { Router } from "express";
import { couponController } from "../../../controllers/apps/ecommerce/index.js";
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
  .post(applyCouponCodeValidator(), validate, couponController.applyCoupon);
router.route("/c/remove").post(couponController.removeCouponFromCart);
// get coupons that customer can apply based on coupons active status and customer's cart value
router
  .route("/customer/available")
  .get(couponController.getValidCouponsForCustomer);

// * ADMIN ROUTES
router.use(verifyPermission([UserRolesEnum.ADMIN]));

router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(createCouponValidator(), validate, couponController.createCoupon);

router
  .route("/:couponId")
  .get(
    mongoIdPathVariableValidator("couponId"),
    validate,
    couponController.getCouponById
  )
  .patch(
    mongoIdPathVariableValidator("couponId"),
    updateCouponValidator(),
    validate,
    couponController.updateCoupon
  )
  .delete(
    mongoIdPathVariableValidator("couponId"),
    validate,
    couponController.deleteCoupon
  );

router
  .route("/status/:couponId")
  .patch(
    mongoIdPathVariableValidator("couponId"),
    couponActivityStatusValidator(),
    validate,
    couponController.updateCouponActiveStatus
  );

export default router;
