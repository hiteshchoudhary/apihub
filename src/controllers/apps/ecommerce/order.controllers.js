import crypto from "crypto";
import { nanoid } from "nanoid";
import Razorpay from "razorpay";
import { PaymentProviderEnum } from "../../../constants.js";
import { Address } from "../../../models/apps/ecommerce/address.models.js";
import { Cart } from "../../../models/apps/ecommerce/cart.models.js";
import { EcomOrder } from "../../../models/apps/ecommerce/order.models.js";
import { Product } from "../../../models/apps/ecommerce/product.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getCart } from "./cart.controllers.js";
import mongoose from "mongoose";

/**
 * @description Utility function which returns a common aggregation pipeline stages responsible to structure an order in a readable and detailed format
 * @returns {import("mongoose").PipelineStage[]}
 */
// REFACTOR: Remove this in case being used in only single place that is get order by id
export const orderStructureAggregator = () => {
  return [
    // lookup for an address associated with the order
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    // lookup for a customer associated with the order
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    // lookup returns array so get the first element of address and customer
    {
      $addFields: {
        customer: { $first: "$customer" },
        address: { $first: "$address" },
      },
    },
    // Now we have array of order items with productId being the id of the product that is being ordered
    // So we want to send complete details of that product

    // To do so we first unwind the items array
    { $unwind: "$items" },

    // it gives us documents with `items` being an object with ket {_id, productId, quantity}
    {
      // lookup for a product associated
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "items.product", // store that looked up product in items.product key
      },
    },
    // As we know lookup will return an array
    // we want product key to be an object not array
    // So, once lookup is done we access first item in an array
    { $addFields: { "items.product": { $first: "$items.product" } } },
    // As we have unwind the items array the output of the following stages is not desired one
    // So to make it desired we need to group whatever we have unwinded
    {
      $group: {
        // we group the documents with `_id (which is an order id)`
        // The reason being, each order is unique and main entity of this api
        _id: "$_id",
        order: { $first: "$$ROOT" }, // we also assign whole root object to be the order
        // we create a new key orderItems in which we will push each order item (product details and quantity) with complete product details
        orderItems: {
          $push: {
            _id: "$items._id",
            quantity: "$items.quantity",
            product: "$items.product",
          },
        },
      },
    },
    {
      $addFields: {
        // now we will create a new items key in the order object and assign the orderItems value to it to keep everything in the `order` key
        "order.items": "$orderItems",
      },
    },
    {
      $project: {
        // ignore the orderItems key as we don't need it
        orderItems: 0,
      },
    },
  ];
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const cart = await Cart.findOne({
    owner: req.user._id,
  });

  if (!cart || !cart.items?.length) {
    throw new ApiError(400, "User cart is empty");
  }

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

  const cart = await Cart.findOne({
    owner: req.user._id,
  });

  if (!cart || !cart.items?.length) {
    throw new ApiError(400, "User cart is empty");
  }
  // Check if address is valid and is of logged in user's
  const address = await Address.findOne({
    _id: addressId,
    owner: req.user._id,
  });

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

    // Logic to handle product's stock change once order is placed
    let bulkStockUpdates = orderItems.map((item) => {
      // Reduce the products stock
      return {
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: -item.quantity } }, // subtract the item quantity
        },
      };
    });

    // * (bulkWrite()) is faster than sending multiple independent operations (e.g. if you use create())
    // * because with bulkWrite() there is only one network round trip to the MongoDB server.
    await Product.bulkWrite(bulkStockUpdates, {
      skipValidation: true,
    });

    cart.items = [];

    await cart.save({ validateBeforeSave: false });
    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } else {
    throw new ApiError(400, "Invalid razorpay signature");
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await EcomOrder.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      },
    },
    ...orderStructureAggregator(),
  ]);

  if (!order[0]) {
    throw new ApiError(404, "Order does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order[0], "Order fetched successfully"));
});

const getOrderListAdmin = asyncHandler(async (req, res) => {
  const orders = await EcomOrder.aggregate([
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    },
    // lookup for a customer associated with the order
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        customer: { $first: "$customer" },
        address: { $first: "$address" },
        totalOrderItems: { $size: "$items" },
      },
    },
    {
      $project: {
        items: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export {
  generateRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getOrderListAdmin,
};
