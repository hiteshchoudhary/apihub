import mongoose from "mongoose";

import { Project } from "../../../models/apps/project-management/project.models.js";
import { Member } from "../../../models/apps/project-management/member.models.js";
import { Task } from "../../../models/apps/project-management/task.models.js";

import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";

const createTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const projectTask = req.body;

  const project = await Project.findById(projectTask.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await Member.findOne({
    projectId: projectTask.projectId,
    userId,
  });
  if (!member) {
    throw new ApiError(404, "Member not found in the project");
  }

  const newProjectTask = await Task.create({
    ...projectTask,
    memberId: member._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { task: newProjectTask },
        "Task created successfully"
      )
    );
});

const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId } = req.params;
  const {
    title,
    priority,
    sortByCreated,
    assignedToMe,
    onlyCompleted,
    createdByMe,
  } = req.query;

  // check if project is existing
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // check if user is a member of the project
  const member = await Member.findOne({ userId, projectId });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  let searchQuery = new RegExp(title, "i");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let pipeline = [
    {
      $match: {
        projectId: new mongoose.Types.ObjectId(projectId),
        ...(createdByMe && {
          memberId: new mongoose.Types.ObjectId(member._id),
        }),
        title: { $regex: searchQuery },
        ...(priority && { priority }),
        ...(assignedToMe && { members: { $in: [member._id] } }),
        $or: [
          ...(onlyCompleted
            ? [{ status: "completed" }]
            : [
                { status: { $in: ["todo", "in_progress", "under_review"] } },
                { status: "completed", updatedAt: { $gte: today } },
              ]),
        ],
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "memberId",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "membersDetails",
      },
    },
    {
      $addFields: {
        members: {
          $map: {
            input: "$membersDetails",
            as: "member",
            in: {
              _id: "$$member._id",
              memberEmailId: "$$member.memberEmailId",
            },
          },
        },
      },
    },
    {
      $project: {
        creator: {
          _id: 0,
          userId: 0,
          projectId: 0,
          invitationStatus: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
        membersDetails: 0,
      },
    },
    { $sort: { createdAt: sortByCreated ? 1 : -1 } },
  ];

  const tasks = await Task.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks }, "Task featching successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const projectTask = req.body;

  const project = await Project.findById(projectTask.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await Member.findOne({
    userId,
    projectId: projectTask.projectId,
  });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  const task = await Task.findById(projectTask.taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  console.log(task, member);
  if (
    member.role !== "admin" &&
    member.role !== "owner" &&
    member._id.toString() !== task.memberId.toString()
  ) {
    throw new ApiError(
      403,
      "Only project owners, admins and creator can update tasks"
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    projectTask.taskId,
    projectTask,
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { task: updatedTask }, "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, taskId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await Member.findOne({
    userId,
    projectId,
  });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  if (member.role === "member") {
    throw new ApiError(403, "Only project owners and admins can delete tasks");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.deleteOne({ _id: taskId });

  return res
    .status(200)
    .json(new ApiError(404, { taskId }, "Task deleted successfully"));
});

const assignMemberToTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, taskId, memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await Member.findOne({
    userId,
    projectId,
  });

  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  if (member.role === "member") {
    throw new ApiError(
      403,
      "Only project owners and admins can assign members"
    );
  }

  const existingMember = await Member.findById(memberId);
  if (!existingMember) {
    throw new ApiError(404, "Member not found");
  }

  //TODO: check already assigned member and also send a notification

  await Task.findByIdAndUpdate(
    taskId,
    { $push: { members: memberId } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { memberId }, "Assigned member to task successfully")
    );
});

const removeMemberFromTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, taskId, memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = await Member.findOne({
    userId,
    projectId,
  });

  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  if (member.role === "member") {
    throw new ApiError(
      403,
      "Only project owners and admins can assign members"
    );
  }

  const existingMember = await Member.findById(memberId);
  if (!existingMember) {
    throw new ApiError(404, "Member not found");
  }

  //TODO: check already assigned member and also send a notification

  await Task.findByIdAndUpdate(
    taskId,
    { $pull: { members: new mongoose.Types.ObjectId(memberId) } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { memberId },
        "Removed assigned member from task successfully"
      )
    );
});

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignMemberToTask,
  removeMemberFromTask,
};
