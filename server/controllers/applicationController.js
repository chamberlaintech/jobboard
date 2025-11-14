import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";

export const createApplication = async (req, res) => {
   const { userId } = req.user;
   const { job } = req.body

   if (!job) {
   throw new BadRequestError("Please provide job ID");
  }

   const existingJob = await Job.findById(job);
   if (!existingJob) {
   throw new NotFoundError(`No job found with id: ${job}`);
  }

   if (!req.file || !req.file.path) {
   throw new BadRequestError("Resume upload failed");
  }
   const application = await Application.create({
        job,
        applicant: userId,
        resumeUrl: req.file.path,
   })

   res.status(StatusCodes.CREATED).json({ application})

}

export const getMyApplications = async (req, res) => {
   const { userId } = req.user;
   const applications = await Application.find({ applicant: userId }).populate("job", "company position location")

   res.status(StatusCodes.OK).json({ count: applications.length, applications })

}

export const getCompanyApplications = async (req, res) => {
   const { userId } = req.user;

   const jobs = await Job.find({ createdBy: userId }).select("_id");

   const jobIds = jobs.map(job => job._id);

   const applications = await Application.find({ job: { $in: jobIds } }).populate("applicant", "name email").populate("job", "position")

   res.status(StatusCodes.OK).json({ count: applications.length, applications })
}

export const updateApplications = async (req, res) => {
  const { id: applicationId } = req.params;
  const { status } = req.body;
  const { userId } = req.user;

  if (!status) {
    throw new BadRequestError("Please provide a status value");
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new NotFoundError(`No application found with id: ${applicationId}`);
  }

  const job = await Job.findById(application.job);
  if (!job || job.createdBy.toString() !== userId) {
    throw new BadRequestError("Not authorized to update this application");
  }

  application.status = status;
  await application.save();

  res.status(StatusCodes.OK).json({ application })
}

export const deleteApplications = async (req, res) => {
  const { id: applicationId } = req.params
  const { userId } = req.user;

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new NotFoundError(`No application found with id: ${applicationId}`);
  }

  if (application.applicant.toString() !== userId) {
    throw new BadRequestError("Not authorized to delete this application");
  }

  await application.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Application deleted successfully"})
}

