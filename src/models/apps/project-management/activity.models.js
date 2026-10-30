import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: String,
      enum: ["Project", "Task", "Milestone", "Comment", "Member"],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

activitySchema.plugin(mongooseAggregatePaginate);

export const ProjectActivity = mongoose.model(
  "ProjectActivity",
  activitySchema
);
