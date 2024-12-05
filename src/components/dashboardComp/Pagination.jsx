import React from "react";

const Pagination = ({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  totalPagesCount,
}) => {
  const maxPagesToShow = 5; // Maximum number of pages to display

  // Calculate the range of page numbers to display
  const getPaginationRange = () => {
    const totalPages = totalPagesCount;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(
      currentPage + Math.floor(maxPagesToShow / 2),
      totalPages
    );

    // Adjust startPage to ensure we show maxPagesToShow pages
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  // Get the array of page numbers to display
  const pageNumbers = getPaginationRange();
  const handlePageChange = (page) => {
    window.scrollTo(0, 0);
    onPageChange(page);
  };

  return (
    <nav>
      <ul className="pagination flex flex-row items-center justify-center">
        {hasPreviousPage && (
          <li className="page-item mx-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="page-link"
            >
              Previous
            </button>
          </li>
        )}
        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`page-item ${
              page === currentPage
                ? "bg-primary px-3 py-1 text-white rounded-md mx-2"
                : "mx-2"
            }`}
          >
            <button
              onClick={() => handlePageChange(page)}
              className="page-link"
            >
              {page}
            </button>
          </li>
        ))}
        {hasNextPage && (
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="page-link mx-2"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
