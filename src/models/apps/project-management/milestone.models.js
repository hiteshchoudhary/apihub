import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  AvailableMilestoneStatuses,
  MilestoneStatusEnum,
} from "../../../constants.js";

const milestoneSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableMilestoneStatuses,
      default: MilestoneStatusEnum.UPCOMING,
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

milestoneSchema.plugin(mongooseAggregatePaginate);

export const Milestone = mongoose.model("Milestone", milestoneSchema);
