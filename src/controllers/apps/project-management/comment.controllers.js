import { ProjectComment } from "../../../models/apps/project-management/comment.models.js";
import { Task } from "../../../models/apps/project-management/task.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const createTaskComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  const comment = await ProjectComment.create({
    content,
    author: req.user._id,
    task: taskId,
    project: task.project,
  });

  const createdComment = await ProjectComment.findById(comment._id).populate(
    "author",
    "username email avatar"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdComment, "Comment created successfully")
    );
});

const getTaskComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  const comments = await ProjectComment.find({ task: taskId })
    .populate("author", "username email avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await ProjectComment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await ProjectComment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedComment: comment },
        "Comment deleted successfully"
      )
    );
});

export { createTaskComment, getTaskComments, deleteComment };
