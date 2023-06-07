import { Router } from "express";
import {
  generateRazorpayOrder,
  getOrderById,
  getOrderListAdmin,
  verifyRazorpayPayment,
} from "../../../controllers/apps/ecommerce/order.controllers.js";
import { isAdmin, verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  generateRazorpayOrderValidator,
  orderPathVariableValidator,
  verifyRazorpayPaymentValidator,
} from "../../../validators/ecommerce/order.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/list/admin").get(isAdmin, getOrderListAdmin);

router
  .route("/provider/razorpay")
  .post(generateRazorpayOrderValidator(), validate, generateRazorpayOrder);

router
  .route("/provider/razorpay/verify-payment")
  .post(verifyRazorpayPaymentValidator(), validate, verifyRazorpayPayment);

router
  .route("/:orderId")
  .get(orderPathVariableValidator(), validate, getOrderById);

export default router;
