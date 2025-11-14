import { useState, useEffect } from "react";

const Searchbar = ({
  onSearch,
  onFilterChange,
  initialSearch = "",
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    sort: "latest",
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilters({ status: "all", type: "all", sort: "latest" });
    if (onSearch) onSearch("");
    if (onFilterChange)
      onFilterChange({ status: "all", type: "all", sort: "latest" });
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      {/* Search Input */}
      <div className="form-control w-full mb-4">
        <div className="input-group flex flex-row items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Search jobs by position, company, or location..."
            className="input input-bordered w-full focus:outline-0"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="btn btn-square btn-outline"
              onClick={handleClear}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-semibold">Status</span>
            </label>
            <select
              className="select select-bordered select-sm focus:outline-0"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="declined">Declined</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-semibold">Type</span>
            </label>
            <select
              className="select select-bordered select-sm focus:outline-0"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-semibold">Sort By</span>
            </label>
            <select
              className="select select-bordered select-sm focus:outline-0"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(filters.status !== "all" ||
            filters.type !== "all" ||
            filters.sort !== "latest" ||
            searchTerm) && (
            <div className="form-control flex justify-end sm:justify-center self-end">
              <label className="label">
                <span className="label-text text-sm opacity-0">Clear</span>
              </label>
              <button
                className="btn btn-outline btn-sm btn-error h-10 min-h-10"
                onClick={handleClear}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
