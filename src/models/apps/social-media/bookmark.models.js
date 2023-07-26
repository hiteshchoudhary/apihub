import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { SocialPost } from "./post.models.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookmarkSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "SocialPost",
    },
    bookmarkedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

bookmarkSchema.plugin(mongooseAggregatePaginate);

export const SocialBookmark = mongoose.model("SocialBookmark", bookmarkSchema);
