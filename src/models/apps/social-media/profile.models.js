import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const profileSchema = new Schema(
  {
    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/800x450.png`,
        localPath: "",
      },
    },
    firstName: {
      type: String,
      default: "John",
    },
    lastName: {
      type: String,
      default: "Doe",
    },
    bio: {
      type: String,
    },
    dob: {
      type: Date,
    },
    location: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialProfile = mongoose.model("SocialProfile", profileSchema);
