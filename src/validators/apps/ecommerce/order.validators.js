import { body, param } from "express-validator";
import { OrderStatusEnum } from "../../../constants.js";

const generateRazorpayPaymentValidator = () => {
  return [
    body("addressId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid address id"),
  ];
};

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

const generatePaypalPaymentValidator = () => {
  return [
    body("addressId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid address id"),
  ];
};

const verifyPaypalPaymentValidator = () => {
  return [
    body("orderId").trim().notEmpty().withMessage("Paypal order id is missing"),
  ];
};

const orderPathVariableValidator = () => {
  return [
    param("orderId").notEmpty().isMongoId().withMessage("Invalid order id"),
  ];
};

const orderUpdateStatusValidator = () => {
  return [
    body("status")
      .trim()
      .notEmpty()
      .isIn(Object.values(OrderStatusEnum))
      .withMessage("Invalid order status"),
  ];
};

export {
  generateRazorpayPaymentValidator,
  verifyRazorpayPaymentValidator,
  generatePaypalPaymentValidator,
  verifyPaypalPaymentValidator,
  orderPathVariableValidator,
  orderUpdateStatusValidator,
};
