import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ApplicationCard = ({
  application,
  isCompany = false,
  onStatusUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStatusChange = async (newStatus) => {
    if (!isCompany) return;

    try {
      await api.patch(`/applications/${application._id}/status`, {
        status: newStatus,
      });
      toast.success("Application status updated!");
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await api.delete(`/applications/${application._id}`);
      toast.success("Application deleted successfully!");
      if (onDelete) onDelete();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete application");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all border border-base-300 hover:border-primary/40 w-full max-w-2xl">
      <div className="card-body p-5 sm:p-6 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            {isCompany ? (
              <>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  {application.applicant?.name || "Unknown Applicant"}
                </h3>
                <p className="text-sm sm:text-base text-neutral/70 mb-1">
                  📧 {application.applicant?.email || "No email"}
                </p>
                <p className="text-sm sm:text-base text-neutral/70 mb-3">
                  💼 Applied for:{" "}
                  <span className="font-medium">
                    {application.job?.position || "Unknown Position"}
                  </span>
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  {application.job?.position || "Unknown Position"}
                </h3>
                <p className="text-sm sm:text-base text-neutral/70 mb-1">
                  🏢 {application.job?.company || "Unknown Company"}
                </p>
                <p className="text-sm sm:text-base text-neutral/70 mb-3">
                  📍 {application.job?.location || "Unknown Location"}
                </p>
              </>
            )}

            {application.resumeUrl && (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-info hover:text-info-focus underline"
              >
                📄 View Resume
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {isCompany ? (
              <>
                {application.status === "submitted" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("reviewed")}
                      className="btn btn-outline btn-info btn-sm"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange("accepted")}
                      className="btn btn-outline btn-success btn-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange("declined")}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Decline
                    </button>
                  </>
                )}
                {application.status === "reviewed" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("accepted")}
                      className="btn btn-outline btn-success btn-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange("declined")}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Decline
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/jobs/${application.job?._id}`)}
                  className="btn btn-outline btn-primary btn-sm"
                >
                  View Job
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline btn-error btn-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status + Date at bottom */}
        <div className="flex items-center justify-between mt-4 border-t border-base-300 pt-3">
          <StatusBadge status={application.status} />
          <span className="text-xs sm:text-sm text-neutral/60">
            Applied on {formatDate(application.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
