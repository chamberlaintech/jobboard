import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6">
      <div className="card w-full max-w-md md:max-w-lg bg-base-100 shadow-lg">
        <div className="card-body p-6 md:p-10">
          <h2 className="card-title justify-center text-primary mb-2 text-xl md:text-2xl">
            Welcome Back
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

            <button
              className="btn btn-primary w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <div className="text-center text-sm mt-2">
            <span className="opacity-70">No account?</span>{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
