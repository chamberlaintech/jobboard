import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import ApplicationModal from "./ApplicationModal";

const JobCard = ({ job, onDelete }) => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isCompany = user?.role === "company";

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${job._id}`);
      toast.success("Job deleted successfully!");
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete job");
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-md hover:shadow-lg transition-all border border-base-300 hover:border-primary/40 w-80 sm:w-96 md:w-104"
      onClick={() => {
        navigate(`/jobs/${job._id}`);
      }}
    >
      <div className="card-body items-center text-center p-5 sm:p-6 cursor-pointer">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary hover:text-primary-focus transition-colors line-clamp-1">
          {job.position}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-neutral/70 mt-2 line-clamp-3">
          {job.company}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-neutral/70 line-clamp-3">
          {job.location}
        </p>

        <div className="flex justify-center gap-3 mt-6">
          {!isCompany && (
            <button
              className="btn btn-accent btn-outline btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (!token) {
                  navigate("/login");
                  return;
                }
                if (user?.role !== "user") {
                  toast.error("Only users can apply for jobs");
                  return;
                }
                setShowModal(true);
              }}
            >
              Apply
            </button>
          )}

          {isCompany && (
            <>
              <button
                className="btn btn-outline btn-info btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-job/${job._id}`);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      <ApplicationModal
        job={job}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          // Optionally refresh or navigate
        }}
      />
    </div>
  );
};

export default JobCard;
