import { body, param } from "express-validator";
import { AvailableOrderStatuses } from "../../../constants.js";

const verifyRazorpayPaymentValidator = () => {
  return [
    body("razorpay_order_id")
      .trim()
      .notEmpty()
      .withMessage("Razorpay order id is missing"),
    body("razorpay_payment_id")
      .trim()
      .notEmpty()
      .withMessage("Razorpay payment id is missing"),
    body("razorpay_signature")
      .trim()
      .notEmpty()
      .withMessage("Razorpay signature is missing"),
  ];
};

const verifyPaypalPaymentValidator = () => {
  return [
    body("orderId").trim().notEmpty().withMessage("Paypal order id is missing"),
  ];
};

const orderUpdateStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .isIn(AvailableOrderStatuses)
      .withMessage("Invalid order status"),
  ];
};

export {
  verifyRazorpayPaymentValidator,
  verifyPaypalPaymentValidator,
  orderUpdateStatusValidator,
};
