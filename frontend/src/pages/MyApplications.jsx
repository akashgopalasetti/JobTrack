import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApplications, deleteApplication } from '../services/applicationService.js';
import SearchFilter from '../components/SearchFilter.jsx';
import ApplicationTable from '../components/ApplicationTable.jsx';
import ApplicationCard from '../components/ApplicationCard.jsx';
import Loading from '../components/Loading.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import '../styles/dashboard.css';

export default function MyApplications({ onShowToast }) {
  const navigate = useNavigate();

  // State
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filter & Search & Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch applications from Express API
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getApplications();
      setApplications(response.data || []);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to load applications from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Combined Search, Filter, and Sort (Client-side for instantaneous responsive filtering)
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Filter by Search (Company Name or Job Title)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.companyName?.toLowerCase().includes(term) ||
          app.jobTitle?.toLowerCase().includes(term)
      );
    }

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Sort by Date Added (createdAt or appliedDate)
    result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : (a.appliedDate ? new Date(a.appliedDate).getTime() : 0);
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : (b.appliedDate ? new Date(b.appliedDate).getTime() : 0);

      if (sortBy === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return result;
  }, [applications, searchTerm, statusFilter, sortBy]);

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'All' || sortBy !== 'desc';

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setSortBy('desc');
  };

  // Edit handler: navigates to '/' with application in state
  const handleEdit = (application) => {
    navigate('/', { state: { application } });
  };

  // Delete confirmation handlers
  const handleDeleteClick = (application) => {
    setDeleteTarget(application);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteApplication(deleteTarget._id);
      onShowToast?.(`Application for ${deleteTarget.companyName} deleted successfully.`, 'success');
      setApplications((prev) => prev.filter((app) => app._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      onShowToast?.(err.message || 'Failed to delete application.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>My Job Applications</h1>
          <p className="dashboard-subtitle">
            Manage and track all positions you have applied to, interviewed for, and received offers from.
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{applications.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Loading State */}
      {isLoading && <Loading message="Fetching applications from MongoDB..." />}

      {/* Error State with Retry */}
      {!isLoading && errorMessage && (
        <div className="state-box">
          <div className="state-icon error" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="state-title">Unable to Load Applications</h2>
          <p className="state-desc">{errorMessage}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchApplications}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State: 0 total records in database */}
      {!isLoading && !errorMessage && applications.length === 0 && (
        <div className="state-box">
          <div className="state-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="state-title">No Applications Yet</h2>
          <p className="state-desc">
            You haven't tracked any job applications yet. Click below to add your first job!
          </p>
          <Link to="/" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Your First Job
          </Link>
        </div>
      )}

      {/* Filtered Empty State: Records exist, but filter returned 0 */}
      {!isLoading &&
        !errorMessage &&
        applications.length > 0 &&
        filteredApplications.length === 0 && (
          <div className="state-box">
            <div className="state-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h2 className="state-title">No Matching Applications</h2>
            <p className="state-desc">
              No applications match your current search and filter criteria. Try adjusting or clearing your filters.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          </div>
        )}

      {/* List / Table of Applications */}
      {!isLoading && !errorMessage && filteredApplications.length > 0 && (
        <>
          {/* Desktop Table View */}
          <ApplicationTable
            applications={filteredApplications}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Mobile Card View */}
          <div className="cards-container">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Job Application"
        message={
          deleteTarget
            ? `Are you sure you want to permanently delete the application for "${deleteTarget.jobTitle}" at "${deleteTarget.companyName}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Application"
        cancelLabel="Keep Application"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
