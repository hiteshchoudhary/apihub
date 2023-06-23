import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [
        {
          url: String,
          localPath: String,
        },
      ],
      default: [],
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialPost = mongoose.model("SocialPost", postSchema);
