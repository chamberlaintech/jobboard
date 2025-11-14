import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import JobForm from "../components/JobForm";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to load job");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen={true} />;
  }

  if (!job) {
    return null; // Will redirect on error
  }

  return <JobForm mode="edit" existingJob={job} />;
};

export default EditJob;
