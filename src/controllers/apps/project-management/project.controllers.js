import mongoose from "mongoose";

import { getMongoosePaginationOptions } from "../../../utils/helpers.js";

import { Project } from "../../../models/apps/project-management/project.models.js";
import { Member } from "../../../models/apps/project-management/member.models.js";
import { User } from "../../../models/apps/auth/user.models.js";

import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js";

const createProject = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, description, tags } = req.body;

  const user = await User.findById(userId);

  // Create a new project
  const project = await Project.create({
    name,
    description,
    tags,
    ownerId: userId,
  });

  // Create a new member with owner role
  const member = await Member.create({
    memberEmailId: user.email,
    userId,
    projectId: project._id,
    invitationStatus: "accepted",
    role: "owner",
  });

  // Add the member to the project's members array
  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(project._id) },
    { $push: { members: new mongoose.Types.ObjectId(member._id) } },
    { new: true }
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, { project, member }, "Project created successfully")
    );
});

const getProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  // Pipeline for get projects from member list
  const aggregationPipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    {
      $addFields: {
        memberId: "$_id",
      },
    },
    {
      $project: {
        _id: "$project._id",
        role: 1,
        memberId: 1,
        name: "$project.name",
        description: "$project.description",
        banner: "$project.banner",
      },
    },
  ];

  const projects = await Member.aggregatePaginate(
    Member.aggregate(aggregationPipeline),
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalProjects",
        docs: "projects",
      },
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { ...projects }, "Projects fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { projectId } = req.params;
  const { name, description, tags } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(projectId), ownerId: userId },
    { $set: { name, description, tags } },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found or not owned by the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { project }, "Project updated successfully"));
});

const getProject = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId } = req.params;

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project
  const member = await Member.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    projectId: new mongoose.Types.ObjectId(projectId),
  });

  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  const projectData = {
    _id: project._id,
    name: project.name,
    description: project.description,
    tags: project.tags,
    banner: project.banner,
    totalMembers: project.members.length,
    role: member.role,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { project: projectData },
        "Project fetched successfully"
      )
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId } = req.params;

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project and is owner of the project
  const member = await Member.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    projectId: new mongoose.Types.ObjectId(projectId),
  });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }
  if (member.role !== "owner") {
    throw new ApiError(403, "Only project owners can delete a project");
  }

  // delete all members of the project and their associated documents
  project.members.forEach(async (member) => {
    await Member.findByIdAndDelete(member);
  });

  // delete the project itself
  await Project.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(projectId),
    ownerId: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { projectId }, "Project deleted successfully"));
});

const inviteMember = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, email, role } = req.body;

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project and is owner of the project
  const member = await Member.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    projectId: new mongoose.Types.ObjectId(projectId),
  });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }
  if (member.role === "member") {
    throw new ApiError(403, "Only project owners and admins can add members");
  }

  // check if user is already a member of the project
  const existingMember = await Member.findOne({
    memberEmailId: email,
    projectId: new mongoose.Types.ObjectId(projectId),
  });
  if (existingMember && existingMember.invitationStatus === "accepted") {
    throw new ApiError(400, "User is already a member of the project");
  }

  // create a new member
  const newMember = await Member.create({
    memberEmailId: email,
    userId: null,
    projectId: project._id,
    invitationStatus: "pending",
    role,
  });

  // Add the member to the project's members array
  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { $push: { members: new mongoose.Types.ObjectId(newMember._id) } },
    { new: true }
  );

  //TODO: send project invitation to this member (email notification)

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { member: newMember },
        "Member created successfully. An email notification has been sent for the project invitation."
      )
    );
});

const removeMember = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, memberId } = req.body;

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project and is owner of the project
  const member = await Member.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    projectId: new mongoose.Types.ObjectId(projectId),
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
      "Only project owners and admins can remove members"
    );
  }

  // check if member exists in the project
  const existingMember = await Member.findById(memberId);
  if (!existingMember) {
    throw new ApiError(404, "Member does not exist in the project");
  }

  // remove the member from the project's members array
  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { $pull: { members: new mongoose.Types.ObjectId(memberId) } },
    { new: true }
  );

  // delete the member from the database
  await Member.findByIdAndDelete(memberId);

  return res
    .status(200)
    .json(new ApiResponse(200, { memberId }, "Member removed successfully"));
});

const getMembers = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project
  const member = await Member.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    projectId: new mongoose.Types.ObjectId(projectId),
  });
  if (!member) {
    throw new ApiError(
      403,
      "Access denied. You are not a member of this project"
    );
  }

  // get members of the project
  const aggregatePipeline = [
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        memberEmailId: 1,
        projectId: 1,
        invitationStatus: 1,
        role: 1,
        user: {
          avatar: 1,
          username: 1,
          email: 1,
        },
      },
    },
  ];

  const members = await Member.aggregatePaginate(
    Member.aggregate(aggregatePipeline),
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalMembers",
        docs: "members",
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { ...members }, "Members fetched successfully"));
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectId, memberId } = req.body;

  const user = await User.findById(userId);

  // check for existing project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  // check if user is a member of the project
  const member = await Member.findById(memberId);
  if (!member) {
    throw new ApiError(404, "Member does not exist in the project");
  }

  if (member.invitationStatus === "accepted") {
    throw new ApiError(400, "Member is already accepted invitation");
  }

  if (member.invitationStatus === "banned") {
    throw new ApiError(403, "Member is banned");
  }

  if (member.memberEmailId !== user.email) {
    throw new ApiError(
      403,
      "Member email address does not match your registered email address"
    );
  }

  // update the member's status to accepted
  await Member.updateOne(
    { _id: new mongoose.Types.ObjectId(memberId) },
    { $set: { invitationStatus: "accepted", userId } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { memberId }, "Invitation accepted successfully")
    );
});

export {
  createProject,
  getProjects,
  updateProject,
  getProject,
  deleteProject,
  inviteMember,
  removeMember,
  getMembers,
  acceptInvitation,
};
