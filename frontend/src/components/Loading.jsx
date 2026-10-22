import React from 'react';

export default function Loading({ message = 'Loading applications...' }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p className="state-title">{message}</p>
      <p className="state-desc">Fetching latest records from your database...</p>
    </div>
  );
}
