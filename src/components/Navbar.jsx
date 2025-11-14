import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoMoon } from "react-icons/io5";
import { IoSunnySharp } from "react-icons/io5";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "nord");

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "nord" ? "sunset" : "nord");
  };

  return (
    <div className="navbar bg-base-100 shadow-md p-4 sm:py-4 sm:px-8">
      <div className="flex-1">
        <Link
          to="/jobs"
          className="text-lg sm:text-xl md:text-2xl font-bold text-primary"
        >
          JobBoard
        </Link>
      </div>
      {!token ? (
        <div className="flex gap-4">
          <Link to="/login" className="btn btn-sm btn-outline btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-sm btn-primary">
            Register
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/dashboard" className="btn btn-sm btn-outline btn-primary">
            Profile
          </Link>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              logout();
              navigate("/jobs");
            }}
          >
            Logout
          </button>
        </div>
      )}
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn btn-sm btn-ghost ml-6 hover:scale-110 transition-transform"
        title="Toggle theme"
      >
        {theme === "nord" ? (
          // 🌙 show moon icon for dark mode
          <IoMoon className="text-primary text-lg" />
        ) : (
          // ☀️ show sun icon for light mode
          <IoSunnySharp className="text-primary text-lg" />
        )}
      </button>
    </div>
  );
};

export default Navbar;
