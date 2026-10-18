import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  AvailableEmploymentTypes,
  AvailableExperienceLevels,
  AvailableWorkModes,
  JobEmploymentTypeEnum,
  JobExperienceLevelEnum,
  JobWorkModeEnum,
} from "../../../constants.js";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: "https://via.placeholder.com/200x200.png",
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    workMode: {
      type: String,
      enum: AvailableWorkModes,
      default: JobWorkModeEnum.ONSITE,
    },
    employmentType: {
      type: String,
      enum: AvailableEmploymentTypes,
      default: JobEmploymentTypeEnum.FULL_TIME,
    },
    experienceLevel: {
      type: String,
      enum: AvailableExperienceLevels,
      default: JobExperienceLevelEnum.MID_LEVEL,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.plugin(mongooseAggregatePaginate);

export const Job = mongoose.model("Job", jobSchema);
