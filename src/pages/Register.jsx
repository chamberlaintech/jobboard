import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token, login } = useAuth();

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data.user, res.data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6">
      <div className="card w-full max-w-md md:max-w-lg bg-base-100 shadow-lg">
        <div className="card-body p-6 md:p-10">
          <h2 className="card-title justify-center text-primary mb-2 text-xl md:text-2xl">
            Register
          </h2>

          {error && (
            <p className="text-error text-sm text-center mb-2">{error}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 md:gap-4"
          >
            <label className="form-control w-full">
              <div className="mb-1">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                name="name"
                className="input input-bordered focus:outline-0 w-full"
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </label>

            <label className="form-control w-full">
              <div className="mb-1">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                name="email"
                className="input input-bordered focus:outline-0 w-full"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>

            <label className="form-control w-full">
              <div className="mb-1">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                name="password"
                className="input input-bordered focus:outline-0 w-full"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </label>

            {/* Role Selection */}
            <label className="form-control w-full">
              <div className="mb-1">
                <span className="label-text">I want to register as</span>
              </div>
              <div className="flex gap-4 mt-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleChange}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">Job Seeker</span>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="company"
                    checked={formData.role === "company"}
                    onChange={handleChange}
                    className="radio radio-primary"
                  />
                  <span className="label-text ml-2">Company</span>
                </label>
              </div>
              <div className="label mt-2 flex justify-center">
                <span className="label-text-alt text-neutral/60">
                  {formData.role === "user"
                    ? "Browse and apply for jobs"
                    : "Post jobs and manage applications"}
                </span>
              </div>
            </label>

            <button
              className="btn btn-primary w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="text-center text-sm mt-2">
            <span className="opacity-70">Already have an account?</span>{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
