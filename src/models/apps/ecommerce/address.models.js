import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const addressSchema = new Schema(
  {
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
    owner: {
      ref: "User",
      type: mongoose.Types.ObjectId,
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
  { timestamps: true }
);

export const Address = mongoose.model("Address", addressSchema);
