import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import Searchbar from "../components/Searchbar";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    sort: "latest",
  });
  const [paginationData, setPaginationData] = useState({
    totalJobs: 0,
    totalPages: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 10, // Jobs per page
        };

        // Add search if provided
        if (searchTerm) {
          params.search = searchTerm;
        }

        // Add filters if not "all"
        if (filters.status !== "all") {
          params.status = filters.status;
        }
        if (filters.type !== "all") {
          params.type = filters.type;
        }
        if (filters.sort) {
          params.sort = filters.sort;
        }

        const res = await api.get("/jobs", { params });
        setJobs(res.data.jobs);
        setPaginationData({
          totalJobs: res.data.totalJobs,
          totalPages: res.data.totalPages,
          pageSize: res.data.pageSize,
        });
      } catch (err) {
        toast.error(err.response?.data?.msg || "Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage, searchTerm, filters]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-40">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-7 sm:mb-8 md:mb-12">
        Available Jobs
      </h1>

      {/* Searchbar */}
      <Searchbar
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        initialSearch={searchTerm}
        showFilters={true}
      />

      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[400px]" />
      ) : (
        <>
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-12 mb-7 sm:mb-8 md:mb-12">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDelete={() => {
                    // Refetch jobs after deletion
                    const fetchJobs = async () => {
                      try {
                        const params = {
                          page: currentPage,
                          limit: 10,
                        };
                        if (searchTerm) params.search = searchTerm;
                        if (filters.status !== "all")
                          params.status = filters.status;
                        if (filters.type !== "all") params.type = filters.type;
                        if (filters.sort) params.sort = filters.sort;
                        const res = await api.get("/jobs", { params });
                        setJobs(res.data.jobs);
                        setPaginationData({
                          totalJobs: res.data.totalJobs,
                          totalPages: res.data.totalPages,
                          pageSize: res.data.pageSize,
                        });
                      } catch (err) {
                        toast.error("Failed to refresh jobs");
                      }
                    };
                    fetchJobs();
                  }}
                />
              ))
            ) : (
              <p className="text-lg text-neutral/60">
                No jobs available at the moment.
              </p>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            pageSize={paginationData.pageSize}
            totalItems={paginationData.totalJobs}
          />
        </>
      )}
    </div>
  );
};

export default Jobs;
