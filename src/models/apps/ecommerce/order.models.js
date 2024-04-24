import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { Address } from "./address.models.js";
import { Product } from "./product.models.js";
import { Coupon } from "./coupon.models.js";
import {
  AvailableOrderStatuses,
  AvailablePaymentProviders,
  OrderStatusEnum,
  PaymentProviderEnum,
} from "../../../constants.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    discountedOrderPrice: {
      type: Number,
      required: true,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
            default: 1,
          },
        },
      ],
      default: [],
    },
    address: {
      addressLine1: {
        required: true,
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        required: true,
        type: String,
      },
      country: {
        required: true,
        type: String,
      },
      pincode: {
        required: true,
        type: String,
      },
      state: {
        required: true,
        type: String,
      },
    },
    status: {
      type: String,
      enum: AvailableOrderStatuses,
      default: OrderStatusEnum.PENDING,
    },
    paymentProvider: {
      type: String,
      enum: AvailablePaymentProviders,
      default: PaymentProviderEnum.UNKNOWN,
    },
    paymentId: {
      type: String,
    },
    // This field shows if the payment is done or not
    isPaymentDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate);

export const EcomOrder = mongoose.model("EcomOrder", orderSchema);
