import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  AvailableProjectMemberRoles,
  AvailableProjectPriorities,
  AvailableProjectStatuses,
  ProjectMemberRoleEnum,
  ProjectPriorityEnum,
  ProjectStatusEnum,
} from "../../../constants.js";

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableProjectMemberRoles,
      default: ProjectMemberRoleEnum.MEMBER,
    },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: AvailableProjectStatuses,
      default: ProjectStatusEnum.PLANNED,
      index: true,
    },
    priority: {
      type: String,
      enum: AvailableProjectPriorities,
      default: ProjectPriorityEnum.MEDIUM,
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [projectMemberSchema],
      default: [],
    },
  },
  { timestamps: true }
);

projectSchema.plugin(mongooseAggregatePaginate);

export const Project = mongoose.model("Project", projectSchema);
