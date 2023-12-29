import { Router } from "express";
import { orderController } from "../../../controllers/apps/ecommerce/index.js";
import {
  verifyPermission,
  verifyJWT,
} from "../../../middlewares/auth.middlewares.js";
import {
  orderUpdateStatusValidator,
  verifyPaypalPaymentValidator,
  verifyRazorpayPaymentValidator,
} from "../../../validators/apps/ecommerce/order.validators.js";
import { validate } from "../../../validators/validate.js";
import { UserRolesEnum } from "../../../constants.js";
import {
  mongoIdPathVariableValidator,
  mongoIdRequestBodyValidator,
} from "../../../validators/common/mongodb.validators.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/provider/razorpay")
  .post(
    mongoIdRequestBodyValidator("addressId"),
    validate,
    orderController.generateRazorpayOrder
  );
router
  .route("/provider/paypal")
  .post(
    mongoIdRequestBodyValidator("addressId"),
    validate,
    orderController.generatePaypalOrder
  );

router
  .route("/provider/razorpay/verify-payment")
  .post(
    verifyRazorpayPaymentValidator(),
    validate,
    orderController.verifyRazorpayPayment
  );

router
  .route("/provider/paypal/verify-payment")
  .post(
    verifyPaypalPaymentValidator(),
    validate,
    orderController.verifyPaypalPayment
  );

router
  .route("/:orderId")
  .get(
    mongoIdPathVariableValidator("orderId"),
    validate,
    orderController.getOrderById
  );

router
  .route("/list/admin")
  .get(
    verifyPermission([UserRolesEnum.ADMIN]),
    orderController.getOrderListAdmin
  );
router
  .route("/status/:orderId")
  .patch(
    verifyPermission([UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator("orderId"),
    orderUpdateStatusValidator(),
    validate,
    orderController.updateOrderStatus
  );

export default router;
