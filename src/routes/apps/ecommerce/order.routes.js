import { Router } from "express";
import {
  generateRazorpayOrder,
  verifyRazorpayPayment,
} from "../../../controllers/apps/ecommerce/order.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  generateRazorpayOrderValidator,
  verifyRazorpayPaymentValidator,
} from "../../../validators/ecommerce/order.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/razorpay")
  .post(generateRazorpayOrderValidator(), validate, generateRazorpayOrder);

router
  .route("/razorpay/verify-payment")
  .post(verifyRazorpayPaymentValidator(), validate, verifyRazorpayPayment);

export default router;
