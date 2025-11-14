import Job from "../models/Job.js";
import Application from "../models/Application.js"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose";

export const getCompanyDashboard = async (req, res) => {
    const { userId } = req.user

    const totalJobs = await Job.countDocuments({ createdBy: userId})

    const jobs = await Job.find({ createdBy: userId }).select("_id");
    const jobIds = jobs.map(j => j._id);

    const stats = await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStats = stats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, { submitted: 0, reviewed: 0, accepted: 0, declined: 0 });

    const totalApplications = stats.reduce((sum, s) => sum + s.count, 0);

    res.status(StatusCodes.OK).json({
        totalJobs,
        totalApplications,
        applicationStats: formattedStats,
    });
}

export const getUserDashboard = async (req, res) => {
  const { userId } = req.user;

  const stats = await Application.aggregate([
    { $match: { applicant: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const formattedStats = stats.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, { submitted: 0, reviewed: 0, accepted: 0, declined: 0 });

  const totalApplications = stats.reduce((sum, s) => sum + s.count, 0);

  res.status(StatusCodes.OK).json({
    totalApplications,
    applicationStats: formattedStats,
  });
};