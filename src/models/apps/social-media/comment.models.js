import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { SocialPost } from "./post.models.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "SocialPost",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const SocialComment = mongoose.model("SocialComment", commentSchema);
