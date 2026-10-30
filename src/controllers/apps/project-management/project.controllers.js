import mongoose from "mongoose";
import { User } from "../../../models/apps/auth/user.models.js";
import { ProjectActivity } from "../../../models/apps/project-management/activity.models.js";
import { Milestone } from "../../../models/apps/project-management/milestone.models.js";
import { Project } from "../../../models/apps/project-management/project.models.js";
import { Task } from "../../../models/apps/project-management/task.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, priority, startDate, dueDate } = req.body;

  const project = await Project.create({
    name,
    description: description || "",
    status,
    priority,
    startDate: startDate || new Date(),
    dueDate,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "OWNER" }],
  });

  await ProjectActivity.create({
    user: req.user._id,
    action: "CREATED_PROJECT",
    relatedEntity: "Project",
    entityId: project._id,
    project: project._id,
  });

  const createdProject = await Project.findById(project._id)
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar");

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdProject, "Project created successfully")
    );
});

const getAllProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, priority } = req.query;

  const matchConditions = {};

  if (search?.trim()) {
    matchConditions.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  if (status) {
    matchConditions.status = status;
  }

  if (priority) {
    matchConditions.priority = priority;
  }

  const projectAggregate = Project.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, email: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project",
        as: "tasks",
      },
    },
    {
      $addFields: {
        totalTasks: { $size: "$tasks" },
        completedTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "t",
              cond: { $eq: ["$$t.status", "COMPLETED"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        progress: {
          $cond: {
            if: { $gt: ["$totalTasks", 0] },
            then: {
              $multiply: [
                { $divide: ["$completedTasks", "$totalTasks"] },
                100,
              ],
            },
            else: 0,
          },
        },
      },
    },
    { $project: { tasks: 0 } },
    { $sort: { createdAt: -1 } },
  ]);

  const projects = await Project.aggregatePaginate(
    projectAggregate,
    getMongoosePaginationOptions({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: { totalDocs: "totalProjects", docs: "projects" },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const projectAggregate = await Project.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, email: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
    {
      $lookup: {
        from: "users",
        localField: "members.user",
        foreignField: "_id",
        as: "memberUsers",
        pipeline: [{ $project: { username: 1, email: 1, avatar: 1 } }],
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project",
        as: "tasks",
      },
    },
    {
      $addFields: {
        totalTasks: { $size: "$tasks" },
        completedTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "t",
              cond: { $eq: ["$$t.status", "COMPLETED"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        progress: {
          $cond: {
            if: { $gt: ["$totalTasks", 0] },
            then: {
              $multiply: [
                { $divide: ["$completedTasks", "$totalTasks"] },
                100,
              ],
            },
            else: 0,
          },
        },
      },
    },
    { $project: { tasks: 0 } },
  ]);

  if (!projectAggregate || projectAggregate.length === 0) {
    throw new ApiError(404, "Project does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, projectAggregate[0], "Project fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status, priority, startDate, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(startDate && { startDate }),
        ...(dueDate && { dueDate }),
      },
    },
    { new: true }
  )
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar");

  await ProjectActivity.create({
    user: req.user._id,
    action: "UPDATED_PROJECT",
    relatedEntity: "Project",
    entityId: project._id,
    project: project._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  await Task.deleteMany({ project: projectId });
  await Milestone.deleteMany({ project: projectId });
  await ProjectActivity.deleteMany({ project: projectId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProject: project },
        "Project deleted successfully"
      )
    );
});

const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role = "MEMBER" } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    throw new ApiError(404, "User with given email does not exist");
  }

  const isAlreadyMember = project.members.some(
    (m) => m.user.toString() === userToAdd._id.toString()
  );

  if (isAlreadyMember) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push({ user: userToAdd._id, role });
  await project.save();

  await ProjectActivity.create({
    user: req.user._id,
    action: `ADDED_MEMBER_${userToAdd.username}`,
    relatedEntity: "Member",
    entityId: userToAdd._id,
    project: project._id,
  });

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProject,
        "Project member added successfully"
      )
    );
});

const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  if (project.owner.toString() === memberId) {
    throw new ApiError(400, "Cannot remove the owner of the project");
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== memberId
  );
  await project.save();

  await ProjectActivity.create({
    user: req.user._id,
    action: "REMOVED_MEMBER",
    relatedEntity: "Member",
    entityId: memberId,
    project: project._id,
  });

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProject,
        "Project member removed successfully"
      )
    );
});

const updateProjectMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const member = project.members.find((m) => m.user.toString() === memberId);
  if (!member) {
    throw new ApiError(404, "Member not found in this project");
  }

  member.role = role;
  await project.save();

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProject,
        "Member role updated successfully"
      )
    );
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateProjectMemberRole,
};
