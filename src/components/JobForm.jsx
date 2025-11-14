import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const JobForm = ({ mode = "create", existingJob }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    type: "full-time",
    status: "pending",
    salary: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingJob) {
      setFormData({
        company: existingJob.company || "",
        position: existingJob.position || "",
        location: existingJob.location || "",
        type: existingJob.type || "full-time",
        status: existingJob.status || "pending",
        salary: existingJob.salary || "",
        tags: existingJob.tags?.join(", ") || "",
      });
    }
  }, [existingJob]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : undefined,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (mode === "create") {
        await api.post("/jobs", payload);
        toast.success("Job created successfully!");
      } else {
        await api.patch(`/jobs/${existingJob._id}`, payload);
        toast.success("Job updated successfully!");
      }

      navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card bg-base-100 shadow-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          {mode === "create" ? "Create Job" : "Edit Job"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {["company", "position", "location"].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              placeholder={`Enter ${field}`}
              className="input input-bordered w-full"
            />
          ))}

          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (optional)"
            className="input input-bordered w-full"
          />

          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="input input-bordered w-full"
          />

          <div className="flex gap-3">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select select-bordered w-1/2"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-1/2"
            >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="declined">Declined</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Job"
              : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
