import mongoose from "mongoose";
import { ProjectActivity } from "../../../models/apps/project-management/activity.models.js";
import { Project } from "../../../models/apps/project-management/project.models.js";
import { Task } from "../../../models/apps/project-management/task.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, assignee, dueDate, labels } =
    req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const task = await Task.create({
    title,
    description: description || "",
    status,
    priority,
    project: projectId,
    assignee,
    dueDate,
    labels: labels || [],
  });

  await ProjectActivity.create({
    user: req.user._id,
    action: `CREATED_TASK_${title}`,
    relatedEntity: "Task",
    entityId: task._id,
    project: projectId,
  });

  const createdTask = await Task.findById(task._id)
    .populate("assignee", "username email avatar")
    .populate("project", "name status priority");

  return res
    .status(201)
    .json(new ApiResponse(201, createdTask, "Task created successfully"));
});

const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { page = 1, limit = 10, search, status, priority } = req.query;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const matchConditions = {
    project: new mongoose.Types.ObjectId(projectId),
  };

  if (search?.trim()) {
    matchConditions.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (status) {
    matchConditions.status = status;
  }

  if (priority) {
    matchConditions.priority = priority;
  }

  const taskAggregate = Task.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: "users",
        localField: "assignee",
        foreignField: "_id",
        as: "assignee",
        pipeline: [{ $project: { username: 1, email: 1, avatar: 1 } }],
      },
    },
    {
      $unwind: {
        path: "$assignee",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const tasks = await Task.aggregatePaginate(
    taskAggregate,
    getMongoosePaginationOptions({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: { totalDocs: "totalTasks", docs: "tasks" },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Project tasks fetched successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate("assignee", "username email avatar")
    .populate("project", "name status priority");

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, assignee, dueDate, labels } =
    req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignee !== undefined && { assignee }),
        ...(dueDate && { dueDate }),
        ...(labels && { labels }),
      },
    },
    { new: true }
  )
    .populate("assignee", "username email avatar")
    .populate("project", "name status priority");

  await ProjectActivity.create({
    user: req.user._id,
    action: `UPDATED_TASK_${updatedTask.title}`,
    relatedEntity: "Task",
    entityId: task._id,
    project: task.project,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  task.status = status;
  await task.save();

  await ProjectActivity.create({
    user: req.user._id,
    action: `CHANGED_TASK_STATUS_TO_${status}`,
    relatedEntity: "Task",
    entityId: task._id,
    project: task.project,
  });

  const updatedTask = await Task.findById(taskId)
    .populate("assignee", "username email avatar")
    .populate("project", "name status priority");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, `Task status updated to ${status}`));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  await ProjectActivity.create({
    user: req.user._id,
    action: "DELETED_TASK",
    relatedEntity: "Task",
    entityId: taskId,
    project: task.project,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTask: task }, "Task deleted successfully")
    );
});

export {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
