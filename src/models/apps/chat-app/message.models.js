import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// TODO: Add image and pdf file sharing in the next version
const chatMessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

chatMessageSchema.plugin(mongooseAggregatePaginate);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
