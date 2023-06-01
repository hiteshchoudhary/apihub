import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { Category } from "./category.models.js";

const productSchema = new Schema(
  {
    category: {
      ref: "Category",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    description: {
      required: true,
      type: String,
    },
    mainImage: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    owner: {
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
    price: {
      default: 0,
      type: Number,
    },
    stock: {
      default: 0,
      type: Number,
    },
    subImages: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
