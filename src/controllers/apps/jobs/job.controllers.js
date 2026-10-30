import { Job } from "../../../models/apps/jobs/job.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    companyName,
    companyLogo,
    location,
    salary,
    workMode,
    employmentType,
    experienceLevel,
    description,
    requirements,
    tags,
  } = req.body;

  const job = await Job.create({
    title,
    companyName,
    companyLogo,
    location,
    salary,
    workMode,
    employmentType,
    experienceLevel,
    description,
    requirements,
    tags,
    postedBy: req.user._id,
  });

  if (!job) {
    throw new ApiError(500, "Something went wrong while creating the job");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job posted successfully"));
});

const getAllJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 15,
    query,
    workMode,
    employmentType,
    experienceLevel,
  } = req.query;

  const aggregatePipeline = [];

  // Search by title or company name if 'query' is provided
  if (query) {
    aggregatePipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { companyName: { $regex: query, $options: "i" } },
        ],
      },
    });
  }
  // Exact match filters

  if (workMode) {
    aggregatePipeline.push({ $match: { workMode: workMode.toUpperCase() } });
  }
  if (employmentType) {
    aggregatePipeline.push({
      $match: { employmentType: employmentType.toUpperCase() },
    });
  }
  if (experienceLevel) {
    aggregatePipeline.push({
      $match: { experienceLevel: experienceLevel.toUpperCase() },
    });
  }

  // Sort by newest first
  aggregatePipeline.push({ $sort: { createdAt: -1 } });

  const jobs = await Job.aggregatePaginate(Job.aggregate(aggregatePipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalItems",
      docs: "data",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

const getRandomJob = asyncHandler(async (req, res) => {
  const randomJob = await Job.aggregate([{ $sample: { size: 1 } }]);

  if (!randomJob?.length) {
    throw new ApiError(404, "No jobs available");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, randomJob[0], "Random job fetched successfully")
    );
});

const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to delete this job");
  }

  await Job.findByIdAndDelete(jobId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully"));
});

export {
  createJob,
  getAllJobs,
  getRandomJob,
  getJobById,
  updateJob,
  deleteJob,
};
