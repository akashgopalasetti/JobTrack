import React from 'react';

const STATUS_CLASS_MAP = {
  Applied: 'status-applied',
  Interview: 'status-interview',
  Assessment: 'status-assessment',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
  Saved: 'status-saved'
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status || 'Applied';
  const statusClass = STATUS_CLASS_MAP[normalizedStatus] || 'status-applied';

  return (
    <span className={`status-badge ${statusClass}`} aria-label={`Status: ${normalizedStatus}`}>
      {normalizedStatus}
    </span>
  );
}
