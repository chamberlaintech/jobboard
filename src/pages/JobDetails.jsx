import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import ApplicationModal from "../components/ApplicationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen={true} />;
  }

  if (!job)
    return (
      <div className="text-center py-12">
        <p className="text-lg text-neutral/70">Job not found.</p>
      </div>
    );

  const handleApply = () => {
    if (!token) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    if (user?.role !== "user") {
      toast.error("Only users can apply for jobs");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-40">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-5 sm:mb-6 md:mb-8">
        {job.position}
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-neutral mb-2 sm:mb-3 md:mb-4">
        {job.company}
      </p>
      <p className="text-sm sm:text-base md:text-lg text-neutral mb-4 sm:mb-5 md:mb-6">
        {job.location} - {job.type}
      </p>

      <div className="border-t border-base-300 my-4 sm:my-5 md:my-6"></div>

      {job.description && (
        <p className="text-sm sm:text-base md:text-lg text-neutral/80 mb-2 sm:mb-3 md:mb-4">
          {job.description}
        </p>
      )}

      {job.salary && (
        <p className="text-sm sm:text-base md:text-lg text-neutral/80 mb-2 sm:mb-3 md:mb-4">
          Salary: <span className="font-medium">${job.salary}</span>
        </p>
      )}

      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 my-4 sm:my-5 md:my-6">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="badge badge-outline badge-primary text-primary px-3 py-2 text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-row gap-3 md:gap-4 mt-5 sm:mt-7 md:mt-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-soft btn-primary"
        >
          ← Back
        </button>
        <button onClick={handleApply} className="btn btn-primary">
          Apply
        </button>
      </div>
      {job && (
        <ApplicationModal
          job={job}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Optionally refresh or navigate
          }}
        />
      )}
    </div>
  );
};

export default JobDetails;
