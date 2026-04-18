import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../lib/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showNeighbors = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > showNeighbors + 2) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - showNeighbors);
      const end = Math.min(totalPages - 1, currentPage + showNeighbors);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (showNeighbors + 1)) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={cn("flex items-center justify-center gap-1.5", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1.5 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "min-w-[40px] px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                isCurrent
                  ? "border-emerald-600 text-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                  : "border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
