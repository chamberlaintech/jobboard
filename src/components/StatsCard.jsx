import React from "react";

const StatsCard = ({ title, value, icon, colorClass = "text-primary" }) => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all border border-base-300">
      <div className="card-body items-center text-center p-6">
        {icon && <div className={`text-4xl mb-2 ${colorClass}`}>{icon}</div>}
        <h3 className="text-2xl sm:text-3xl font-bold text-primary">{value}</h3>
        <p className="text-sm sm:text-base text-neutral/70 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
