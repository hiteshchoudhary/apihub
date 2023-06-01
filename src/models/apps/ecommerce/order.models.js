import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { Address } from "./address.models.js";

// TODO: Add cartItem model once finalize and connect it to the order Schema as a cartItems[]
const orderSchema = new Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      enum: ["PENDING", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const EcomOrder = mongoose.model("EcomOrder", orderSchema);
