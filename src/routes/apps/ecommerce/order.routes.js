import { Router } from "express";
import {
  generatePaypalOrder,
  generateRazorpayOrder,
  getOrderById,
  getOrderListAdmin,
  updateOrderStatus,
  verifyPaypalPayment,
  verifyRazorpayPayment,
} from "../../../controllers/apps/ecommerce/order.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  generateRazorpayPaymentValidator,
  orderPathVariableValidator,
  orderUpdateStatusValidator,
  verifyPaypalPaymentValidator,
  verifyRazorpayPaymentValidator,
} from "../../../validators/ecommerce/order.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/provider/razorpay")
  .post(generateRazorpayPaymentValidator(), validate, generateRazorpayOrder);
router.route("/provider/paypal").post(generatePaypalOrder);

router
  .route("/provider/razorpay/verify-payment")
  .post(verifyRazorpayPaymentValidator(), validate, verifyRazorpayPayment);

router
  .route("/provider/paypal/verify-payment")
  .post(verifyPaypalPaymentValidator(), validate, verifyPaypalPayment);

router
  .route("/:orderId")
  .get(orderPathVariableValidator(), validate, getOrderById);

router.route("/list/admin").get(isAdmin, getOrderListAdmin);
router
  .route("/status/:orderId")
  .patch(
    isAdmin,
    orderPathVariableValidator(),
    orderUpdateStatusValidator(),
    validate,
    updateOrderStatus
  );

export default router;
