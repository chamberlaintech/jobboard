import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'update', 'password'

  // Profile update form
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Update profileData when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.patch("/auth/profile", profileData);
      toast.success("Profile updated successfully!");
      // Update user context with new data
      updateUser({
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-40">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 sm:mb-4">
            Profile Settings
          </h1>
          <p className="text-lg sm:text-xl text-neutral/70">
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center mb-8">
          <button
            className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Account Info
          </button>
          <button
            className={`tab ${activeTab === "update" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("update")}
          >
            Update Profile
          </button>
          <button
            className={`tab ${activeTab === "password" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {/* Account Info Tab */}
        {activeTab === "info" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6 md:p-10">
              <h2 className="card-title text-2xl mb-6">Account Information</h2>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-base-300">
                  <div>
                    <p className="text-sm text-neutral/70 mb-1">Name</p>
                    <p className="text-lg font-semibold">
                      {user?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-base-300">
                  <div>
                    <p className="text-sm text-neutral/70 mb-1">Email</p>
                    <p className="text-lg font-semibold">
                      {user?.email || "Not available"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
                  <div>
                    <p className="text-sm text-neutral/70 mb-1">Account Type</p>
                    <p className="text-lg font-semibold capitalize">
                      {user?.role === "company" ? "🏢 Company" : "👤 User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Profile Tab */}
        {activeTab === "update" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6 md:p-10">
              <h2 className="card-title text-2xl mb-6">Update Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <label className="form-control w-full ">
                  <div className="mb-1">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered focus:outline-0 w-full mb-4"
                    placeholder="Your name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                    minLength={3}
                    maxLength={50}
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
                    placeholder="your@email.com"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                  />
                </label>

                <button
                  className="btn btn-primary w-full mt-6"
                  disabled={profileLoading}
                  type="submit"
                >
                  {profileLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6 md:p-10">
              <h2 className="card-title text-2xl mb-6">Change Password</h2>
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <label className="form-control w-full">
                  <div className="mb-1">
                    <span className="label-text">Current Password</span>
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    className="input input-bordered focus:outline-0 w-full mb-4"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>

                <label className="form-control w-full">
                  <div className="mb-1">
                    <span className="label-text">New Password</span>
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    className="input input-bordered focus:outline-0 w-full mb-4"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="mb-1">
                    <span className="label-text">Confirm New Password</span>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input input-bordered focus:outline-0 w-full"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                  />
                </label>

                <button
                  className="btn btn-primary w-full mt-6"
                  disabled={passwordLoading}
                  type="submit"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
