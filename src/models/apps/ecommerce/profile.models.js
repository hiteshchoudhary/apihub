import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "John",
    },
    lastName: {
      type: String,
      default: "Doe",
    },
    countryCode: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const EcomProfile = mongoose.model("EcomProfile", profileSchema);
