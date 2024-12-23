import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "under_review", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Member",
      required: false,
    },
    completedDate: {
      type: Date,
      default: null,
      required: false,
    },
    subtasks: {
      type: [{ title: String, isCompleted: Boolean }],
      required: false,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
