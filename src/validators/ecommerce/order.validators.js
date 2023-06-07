import { body, param } from "express-validator";

const generateRazorpayOrderValidator = () => {
  return [
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Invalid amount"),
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
    body("addressId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid address id"),
  ];
};

const orderPathVariableValidator = () => {
  return [
    param("orderId").notEmpty().isMongoId().withMessage("Invalid order id"),
  ];
};

export {
  generateRazorpayOrderValidator,
  verifyRazorpayPaymentValidator,
  orderPathVariableValidator,
};
