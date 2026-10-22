import React from 'react';

const STATUS_OPTIONS = [
  'All',
  'Applied',
  'Interview',
  'Assessment',
  'Offer',
  'Rejected',
  'Saved'
];

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}) {
  return (
    <div className="filter-toolbar">
      <div className="search-box">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search by company or job title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search applications"
        />
      </div>

      <div className="filter-controls">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Statuses' : status}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort applications by applied date"
        >
          <option value="desc">Date Added: Newest First</option>
          <option value="asc">Date Added: Oldest First</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClearFilters}
            title="Reset search and filters to default"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
