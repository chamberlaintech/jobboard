import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isCompany = user?.role === "company";

  const isActive = (path) => {
    if (path === "/jobs" && location.pathname === "/jobs") return true;
    if (path !== "/jobs" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const companyLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/create-job", label: "Create Job", icon: "➕" },
    { path: "/jobs", label: "My Jobs", icon: "💼" },
    { path: "/company/applications", label: "Applications", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const userLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/jobs", label: "Browse Jobs", icon: "🔍" },
    { path: "/applications", label: "My Applications", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const links = isCompany ? companyLinks : userLinks;

  return (
    <div className="hidden md:flex md:w-56 lg:w-64 bg-base-200 min-h-screen p-3 sm:p-4 md:p-6 shadow-lg shrink-0">
      <div className="flex flex-col gap-2 w-full">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
              isActive(link.path)
                ? "bg-primary text-primary-content font-semibold"
                : "hover:bg-base-300 text-base-content"
            }`}
          >
            <span className="text-lg md:text-xl shrink-0">{link.icon}</span>
            <span className="text-xs md:text-sm lg:text-base truncate">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
