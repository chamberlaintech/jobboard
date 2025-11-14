import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && typeof page === "number") {
      onPageChange(page);
    }
  };

  // Calculate range of items shown
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Info text */}
      <div className="text-sm text-neutral/70">
        Showing {startItem} to {endItem} of {totalItems} jobs
      </div>

      {/* Pagination controls */}
      <div className="join">
        {/* Previous button */}
        <button
          className="join-item btn btn-outline btn-primary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          «
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <button
                key={`ellipsis-${index}`}
                className="join-item btn btn-disabled"
              >
                ...
              </button>
            );
          }

          return (
            <button
              key={page}
              className={`join-item btn ${
                page === currentPage
                  ? "btn-active btn-primary"
                  : "btn-outline btn-primary"
              }`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          );
        })}

        {/* Next button */}
        <button
          className="join-item btn btn-outline btn-primary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
