import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not-found.js";
import BadRequestError from "../errors/bad-request.js";

export const getAllJobs = async (req, res) => {
  const { search, status, type, sort, page, limit } = req.query;
  const queryObject = {};

  if (req.user && req.user.userId) {
    queryObject.createdBy = req.user.userId;
  }

  if (status && status !== "all") queryObject.status = status;
  if (type && type !== "all") queryObject.type = type;
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  let result = Job.find(queryObject);

  // Sorting
  if (sort === "latest") result = result.sort("-createdAt");
  if (sort === "oldest") result = result.sort("createdAt");
  if (sort === "a-z") result = result.sort("position");
  if (sort === "z-a") result = result.sort("-position");

  // Apply pagination
  result = result.skip(skip).limit(pageSize);

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const totalPages = Math.ceil(totalJobs / pageSize);

  res.status(StatusCodes.OK).json({
    totalJobs,
    jobs,
    currentPage: pageNumber,
    totalPages,
    pageSize,
  });
};



export const getJob = async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

export const updateJob = async (req, res) => {
    const { body: {company, position, status, type, location, salary, tags }, user: {userId}, params: { id:jobId}} = req

    if (company === "" || position === "" || location === "") {
        throw new BadRequestError("Please provide all values")
    }
    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true})

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })
}

export const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId}} = req

    const job = await Job.findOneAndDelete({_id: jobId, createdBy: userId})

    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })
}

