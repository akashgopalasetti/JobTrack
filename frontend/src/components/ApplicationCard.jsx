import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function ApplicationCard({ application, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  return (
    <article className="app-card">
      <div className="app-card-header">
        <div>
          <h2 className="app-card-title">{application.jobTitle}</h2>
          <p className="app-card-company">{application.companyName}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="app-card-details">
        <div className="app-card-detail-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Added: {formatDate(application.createdAt || application.appliedDate)}</span>
        </div>

        {application.followUpDate && (
          <div className="app-card-detail-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Follow-up: {formatDate(application.followUpDate)}</span>
          </div>
        )}

        {application.recruiterName && (
          <div className="app-card-detail-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Recruiter: {application.recruiterName}</span>
          </div>
        )}

        {application.appliedEmail && (
          <div className="app-card-detail-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <a href={`mailto:${application.appliedEmail}`} className="link-btn">
              {application.appliedEmail}
            </a>
          </div>
        )}

        {application.notes && (
          <div className="app-card-detail-item" style={{ alignItems: 'flex-start' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '3px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span style={{ whiteSpace: 'pre-line' }}>{application.notes}</span>
          </div>
        )}
      </div>

      <div className="app-card-links">
        {application.jobPostingUrl && (
          <a
            href={application.jobPostingUrl.startsWith('http') ? application.jobPostingUrl : `https://${application.jobPostingUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Job Posting
          </a>
        )}

        {application.resumeLink && (
          <a
            href={application.resumeLink.startsWith('http') ? application.resumeLink : `https://${application.resumeLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {application.resumeName ? `Resume: ${application.resumeName}` : 'View Resume'}
          </a>
        )}
        {!application.resumeLink && application.resumeName && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Resume: {application.resumeName}
          </span>
        )}
      </div>

      <div className="app-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(application)}
          aria-label={`Edit ${application.jobTitle} at ${application.companyName}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ color: '#ef4444' }}
          onClick={() => onDelete(application)}
          aria-label={`Delete ${application.jobTitle} at ${application.companyName}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}
