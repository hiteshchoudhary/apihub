import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const followSchema = new Schema(
  {
    // The one who follows
    followerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    // The one who is being followed
    followeeId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialFollow = mongoose.model("SocialFollow", followSchema);
