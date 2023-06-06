import crypto from "crypto";
import { nanoid } from "nanoid";
import Razorpay from "razorpay";
import { PaymentProviderEnum } from "../../../constants.js";
import { Address } from "../../../models/apps/ecommerce/address.models.js";
import { Cart } from "../../../models/apps/ecommerce/cart.models.js";
import { EcomOrder } from "../../../models/apps/ecommerce/order.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getCart } from "./cart.controllers.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const orderOptions = {
    amount: parseInt(amount),
    currency: "INR", // Might accept from client
    receipt: nanoid(10),
  };

  razorpayInstance.orders.create(orderOptions, async function (err, order) {
    if (err && err.error) {
      // Throwing ApiError here will not trigger the error handler middleware
      return res
        .status(err.statusCode)
        .json(
          new ApiResponse(
            err.statusCode,
            null,
            err.error.reason ||
              "Something went wrong while initialising the razorpay order."
          )
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, order, "Razorpay order generated"));
  });
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    addressId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const address = await Address.findById(addressId);

  if (!address) {
    throw new ApiError(404, "Address does not exists");
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // If payment is valid

    // Get the user's card
    const cart = await Cart.findOne({
      owner: req.user._id,
    });

    // User's cart and order model has the same structure
    // First get the items in the cart
    const orderItems = cart.items;

    // Then query the cart and format the data in desired structure using helper method
    const userCart = await getCart(req.user._id);

    // calculate the total price of the order
    const totalPrice = userCart.reduce((prev, curr) => {
      return prev + curr?.product?.price * curr?.quantity;
    }, 0);

    // Create an order instance
    const order = await EcomOrder.create({
      address: addressId,
      customer: req.user._id,
      isPaymentDone: true,
      items: orderItems,
      orderPrice: totalPrice ?? 0,
      paymentProvider: PaymentProviderEnum.RAZORPAY,
      paymentId: razorpay_payment_id,
    });

    // Once the order is created empty the user cart
    cart.items = [];
    await cart.save({ validateBeforeSave: false });
    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } else {
    throw new ApiError(400, "Invalid razorpay signature");
  }
});

export { generateRazorpayOrder, verifyRazorpayPayment };
