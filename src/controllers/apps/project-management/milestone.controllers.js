import { ProjectActivity } from "../../../models/apps/project-management/activity.models.js";
import { Milestone } from "../../../models/apps/project-management/milestone.models.js";
import { Project } from "../../../models/apps/project-management/project.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const createMilestone = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, dueDate, status } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const milestone = await Milestone.create({
    name,
    description: description || "",
    dueDate,
    status,
    project: projectId,
  });

  await ProjectActivity.create({
    user: req.user._id,
    action: `CREATED_MILESTONE_${name}`,
    relatedEntity: "Milestone",
    entityId: milestone._id,
    project: projectId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, milestone, "Milestone created successfully")
    );
});

const getProjectMilestones = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const milestones = await Milestone.find({ project: projectId }).sort({
    dueDate: 1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        milestones,
        "Project milestones fetched successfully"
      )
    );
});

const getMilestoneById = asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, milestone, "Milestone fetched successfully")
    );
});

const updateMilestone = asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;
  const { name, description, dueDate, status } = req.body;

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone does not exist");
  }

  const updatedMilestone = await Milestone.findByIdAndUpdate(
    milestoneId,
    {
      $set: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(dueDate && { dueDate }),
        ...(status && { status }),
      },
    },
    { new: true }
  );

  await ProjectActivity.create({
    user: req.user._id,
    action: `UPDATED_MILESTONE_${updatedMilestone.name}`,
    relatedEntity: "Milestone",
    entityId: milestone._id,
    project: milestone.project,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMilestone,
        "Milestone updated successfully"
      )
    );
});

const deleteMilestone = asyncHandler(async (req, res) => {
  const { milestoneId } = req.params;

  const milestone = await Milestone.findByIdAndDelete(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone does not exist");
  }

  await ProjectActivity.create({
    user: req.user._id,
    action: "DELETED_MILESTONE",
    relatedEntity: "Milestone",
    entityId: milestoneId,
    project: milestone.project,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedMilestone: milestone },
        "Milestone deleted successfully"
      )
    );
});

export {
  createMilestone,
  getProjectMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};
