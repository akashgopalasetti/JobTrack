import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
        <div className="toast-content">
          <span className="toast-title">
            {isSuccess ? '✅ Success' : '⚠️ Notice'}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
