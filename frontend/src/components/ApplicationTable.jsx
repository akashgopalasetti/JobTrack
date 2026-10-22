import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function ApplicationTable({ applications, onEdit, onDelete }) {
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
    <div className="table-container">
      <table className="apps-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Date Added</th>
            <th>Posting & Resume</th>
            <th>Contact / Recruiter</th>
            <th>Follow-up</th>
            <th>Notes</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="company-cell">{app.companyName}</td>
              <td className="job-cell">{app.jobTitle}</td>
              <td>
                <StatusBadge status={app.status} />
              </td>
              <td className="date-cell">{formatDate(app.createdAt || app.appliedDate)}</td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {app.jobPostingUrl ? (
                    <a
                      href={app.jobPostingUrl.startsWith('http') ? app.jobPostingUrl : `https://${app.jobPostingUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      title={app.jobPostingUrl}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Posting Link
                    </a>
                  ) : null}

                  {app.resumeLink ? (
                    <a
                      href={app.resumeLink.startsWith('http') ? app.resumeLink : `https://${app.resumeLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      title={app.resumeName || app.resumeLink}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {app.resumeName ? `Resume (${app.resumeName})` : 'Resume Link'}
                    </a>
                  ) : app.resumeName ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      📄 {app.resumeName}
                    </span>
                  ) : null}

                  {!app.jobPostingUrl && !app.resumeLink && !app.resumeName && (
                    <span style={{ color: 'var(--text-light)' }}>—</span>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {app.recruiterName && (
                    <span style={{ fontWeight: 500 }}>{app.recruiterName}</span>
                  )}
                  {app.appliedEmail && (
                    <a href={`mailto:${app.appliedEmail}`} className="link-btn" style={{ fontSize: '0.785rem' }}>
                      {app.appliedEmail}
                    </a>
                  )}
                  {!app.recruiterName && !app.appliedEmail && (
                    <span style={{ color: 'var(--text-light)' }}>—</span>
                  )}
                </div>
              </td>
              <td className="date-cell">{formatDate(app.followUpDate)}</td>
              <td>
                {app.notes ? (
                  <span className="notes-preview" title={app.notes}>
                    {app.notes}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-light)' }}>—</span>
                )}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    title={`Edit ${app.jobTitle}`}
                    onClick={() => onEdit(app)}
                    aria-label={`Edit ${app.jobTitle} at ${app.companyName}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-icon"
                    title={`Delete ${app.jobTitle}`}
                    onClick={() => onDelete(app)}
                    aria-label={`Delete ${app.jobTitle} at ${app.companyName}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
