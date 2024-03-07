import { body, param } from "express-validator";
import { AvailableCouponTypes } from "../../../constants.js";

const createCouponValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Coupon name is required"),
    body("couponCode")
      .trim()
      .notEmpty()
      .withMessage("Coupon code is required")
      .isLength({ min: 4 })
      .withMessage("Coupon code must be at least 4 characters long"),
    body("type")
      .optional()
      .trim()
      .notEmpty()
      .isIn(AvailableCouponTypes)
      .withMessage("Invalid coupon type"),
    body("discountValue")
      .trim()
      .notEmpty()
      .withMessage("Discount value is required")
      .isInt({
        min: 1,
      })
      .withMessage("Discount value must be greater than 0"),
    body("minimumCartValue")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Invalid minimum cart value")
      .isInt({
        min: 0,
      })
      .withMessage("Minimum cart value cannot be negative"),
    body("startDate")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Invalid start date. Date must be in ISO8601 format"),
    body("expiryDate")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Expiry date is required")
      .isISO8601()
      .withMessage("Invalid expiry date. Date must be in ISO8601 format")
      .isAfter(new Date().toISOString())
      .withMessage("Expiry date must be a future date"),
  ];
};

const updateCouponValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Coupon name is required"),
    body("couponCode")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Coupon code is required")
      .isLength({ min: 4 })
      .withMessage("Coupon code must be at least 4 characters long"),
    body("type")
      .optional()
      .trim()
      .notEmpty()
      .isIn(AvailableCouponTypes)
      .withMessage("Invalid coupon type"),
    body("discountValue")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Discount value is required")
      .isInt({
        min: 1,
      })
      .withMessage("Discount value must be greater than 0"),
    body("minimumCartValue")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Invalid minimum cart value")
      .isInt({
        min: 0,
      })
      .withMessage("Minimum cart value cannot be negative"),
    body("startDate")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .withMessage("Invalid start date. Date must be in ISO8601 format"),
    body("expiryDate")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Expiry date is required")
      .isISO8601()
      .withMessage("Invalid expiry date. Date must be in ISO8601 format")
      .isAfter(new Date().toISOString())
      .withMessage("Expiry date must be a future date"),
  ];
};

const applyCouponCodeValidator = () => {
  return [
    body("couponCode")
      .trim()
      .notEmpty()
      .withMessage("Coupon code is required")
      .isLength({ min: 4 })
      .withMessage("Invalid coupon code"),
  ];
};

const couponActivityStatusValidator = () => {
  return [
    body("isActive")
      .notEmpty()
      .withMessage("Activity status is required")
      .isBoolean({
        strict: true,
      })
      .withMessage("isActive must be a boolean. Either true or false"),
  ];
};

export {
  applyCouponCodeValidator,
  couponActivityStatusValidator,
  createCouponValidator,
  updateCouponValidator,
};
