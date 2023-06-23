import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { SocialPost } from "./post.models.js";

const likeSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "SocialPost",
    },
    likedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialLike = mongoose.model("SocialLike", likeSchema);
