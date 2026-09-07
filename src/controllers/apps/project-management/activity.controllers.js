import { ProjectActivity } from "../../../models/apps/project-management/activity.models.js";
import { Project } from "../../../models/apps/project-management/project.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const getProjectActivities = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project does not exist");
  }

  const activities = await ProjectActivity.find({ project: projectId })
    .populate("user", "username email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activities,
        "Project activity history fetched successfully"
      )
    );
});

export { getProjectActivities };
