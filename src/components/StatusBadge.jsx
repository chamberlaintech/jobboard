import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      submitted: {
        label: "Submitted",
        className: "badge-warning",
        icon: "📤",
      },
      reviewed: {
        label: "Reviewed",
        className: "badge-info",
        icon: "👀",
      },
      accepted: {
        label: "Accepted",
        className: "badge-success",
        icon: "✅",
      },
      declined: {
        label: "Declined",
        className: "badge-error",
        icon: "❌",
      },
    };
    return configs[status] || configs.submitted;
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`badge ${config.className} gap-2 px-3 py-2 text-sm font-medium`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
