import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import StatsCard from "../components/StatsCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isCompany = user?.role === "company";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = isCompany ? "/dashboard/company" : "/dashboard/user";
        const res = await api.get(endpoint);
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isCompany]);

  if (loading) {
    return <LoadingSpinner size="lg" fullScreen={true} />;
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <p className="text-lg text-neutral/70">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const applicationStats = stats.applicationStats || {};

  const handleLogout = () => {
    logout();
    navigate("/jobs");
  };

  return (
    <div className="flex flex-col min-h-screen py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-40">
      <div className="max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 sm:mb-4">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-lg sm:text-xl text-neutral/70">
            {isCompany
              ? "Manage your job postings and applications"
              : "Track your job applications and status"}
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {isCompany && (
            <StatsCard
              title="Total Jobs Posted"
              value={stats.totalJobs || 0}
              icon="💼"
              colorClass="text-primary"
            />
          )}
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications || 0}
            icon="📋"
            colorClass="text-info"
          />
          {!isCompany && applicationStats.submitted > 0 && (
            <StatsCard
              title="Submitted"
              value={applicationStats.submitted || 0}
              icon="📤"
              colorClass="text-warning"
            />
          )}
        </div>

        {/* Application Status Breakdown - Only for Users */}
        {!isCompany && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
              Application Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center p-5 sm:p-6">
                  <div className="text-3xl mb-2">📤</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-warning">
                    {applicationStats.submitted || 0}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral/70">
                    Submitted
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center p-5 sm:p-6">
                  <div className="text-3xl mb-2">👀</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-info">
                    {applicationStats.reviewed || 0}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral/70">
                    Reviewed
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center p-5 sm:p-6">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-success">
                    {applicationStats.accepted || 0}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral/70">
                    Accepted
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-md border border-base-300">
                <div className="card-body items-center text-center p-5 sm:p-6">
                  <div className="text-3xl mb-2">❌</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-error">
                    {applicationStats.declined || 0}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral/70">
                    Declined
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 sm:mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
            Quick Actions
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {isCompany ? (
              <>
                <button
                  onClick={() => navigate("/create-job")}
                  className="btn btn-primary btn-lg"
                >
                  ➕ Create New Job
                </button>
                <button
                  onClick={() => navigate("/company/applications")}
                  className="btn btn-outline btn-info btn-lg"
                >
                  📋 View Applications
                </button>
                <button
                  onClick={() => navigate("/jobs")}
                  className="btn btn-outline btn-primary btn-lg"
                >
                  🔍 Browse All Jobs
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/jobs")}
                  className="btn btn-primary btn-lg"
                >
                  🔍 Browse Jobs
                </button>
                <button
                  onClick={() => navigate("/applications")}
                  className="btn btn-outline btn-info btn-lg"
                >
                  📋 My Applications
                </button>
              </>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-12 sm:mt-16 md:mt-20 mb-8">
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm sm:btn-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
