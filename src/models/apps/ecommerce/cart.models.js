import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { Product } from "./product.models.js";

const cartSchema = new Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
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
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);