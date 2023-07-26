import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { SocialPost } from "./post.models.js";
import { SocialComment } from "./comment.models.js";

const likeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "SocialPost",
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "SocialComment",
      default: null,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialLike = mongoose.model("SocialLike", likeSchema);
