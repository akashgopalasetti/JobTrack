import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm.jsx';
import { getApplicationById } from '../services/applicationService.js';
import Loading from '../components/Loading.jsx';

export default function AddJob({ onShowToast }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [initialData, setInitialData] = useState(location.state?.application || null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // If navigation state had the application, use it
    if (location.state?.application) {
      setInitialData(location.state.application);
      return;
    }

    // Otherwise, if an ?id= parameter was provided, fetch the record
    if (editId) {
      let isMounted = true;
      setIsLoading(true);
      setFetchError(null);

      getApplicationById(editId)
        .then((res) => {
          if (isMounted) {
            setInitialData(res.data);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setFetchError(err.message || 'Failed to load application details.');
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setInitialData(null);
    }
  }, [location.state, editId]);

  if (isLoading) {
    return <Loading message="Loading application details for editing..." />;
  }

  if (fetchError) {
    return (
      <div className="state-box">
        <div className="state-icon error">⚠️</div>
        <h2 className="state-title">Error Loading Application</h2>
        <p className="state-desc">{fetchError}</p>
      </div>
    );
  }

  return <ApplicationForm initialData={initialData} onShowToast={onShowToast} />;
}
