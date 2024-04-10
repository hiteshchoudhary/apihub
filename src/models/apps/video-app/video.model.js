import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: [
        {
          url: String,
          publicId: String,
        },
      ],
      require: true,
    },
    thumbnail: {
      type: [
        {
          url: String,
          publicId: String,
        },
      ],
      require: true,
    },
    title: {
      type: String,
      require: true,
      index: true,
    },
    description: {
      type: String,
      require: true,
    },
    duration: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isForKids: {
      type: Number,
      default: 0,
    },
    isRestrict: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
videoSchema.plugin(aggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
