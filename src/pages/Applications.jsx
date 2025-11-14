import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import ApplicationCard from "../components/ApplicationCard";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "user") {
      navigate("/dashboard");
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");
        setApplications(res.data.applications);
      } catch (err) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  const handleDelete = () => {
    // Refetch applications after deletion
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my");
        setApplications(res.data.applications);
      } catch (err) {
        toast.error("Failed to refresh applications");
      }
    };
    fetchApplications();
  };

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen={true} />;
  }

  return (
    <div className="flex flex-col min-h-screen items-center text-center py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-40">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-7 sm:mb-8 md:mb-12">
        My Applications
      </h1>
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-6 sm:gap-8">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              isCompany={false}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-neutral/60 mb-4">
              No applications found.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="btn btn-primary"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
