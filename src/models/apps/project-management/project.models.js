import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      required: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: {
      type: [String],
      required: true,
    },

    banner: {
      type: String,
      required: false,
      default: `https://placehold.co/300x200/png`,
    },

    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
