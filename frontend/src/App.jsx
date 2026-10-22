import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import AddJob from './pages/AddJob.jsx';
import MyApplications from './pages/MyApplications.jsx';

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<AddJob onShowToast={showToast} />} />
          <Route
            path="/applications"
            element={<MyApplications onShowToast={showToast} />}
          />
          {/* Fallback to Add Job page directly */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
