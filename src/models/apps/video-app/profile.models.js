import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    fullname: {
      type: String,
      default: "John Doe",
    },
    username: {
      type: String,
      default: "John11",
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/200x200.png",
    },
    coverImage: {
      type: String,
      default: "https://via.placeholder.com/200x200.png",
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const VideoAppProfile = mongoose.model("VideoAppProfile", profileSchema);
