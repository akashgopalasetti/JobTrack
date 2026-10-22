import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication, updateApplication } from '../services/applicationService.js';
import '../styles/form.css';

const STATUS_OPTIONS = [
  'Applied',
  'Interview',
  'Assessment',
  'Offer',
  'Rejected',
  'Saved'
];

const INITIAL_FORM_STATE = {
  companyName: '',
  jobTitle: '',
  status: 'Applied',
  jobPostingUrl: '',
  resumeName: '',
  resumeLink: '',
  appliedEmail: '',
  recruiterName: '',
  followUpDate: '',
  notes: ''
};

// Helper to convert ISO date string to YYYY-MM-DD for <input type="date" />
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export default function ApplicationForm({ initialData = null, onShowToast }) {
  const navigate = useNavigate();
  const isEditing = Boolean(initialData && initialData._id);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        jobTitle: initialData.jobTitle || '',
        status: initialData.status || 'Applied',
        jobPostingUrl: initialData.jobPostingUrl || '',
        resumeName: initialData.resumeName || '',
        resumeLink: initialData.resumeLink || '',
        appliedEmail: initialData.appliedEmail || '',
        recruiterName: initialData.recruiterName || '',
        followUpDate: formatDateForInput(initialData.followUpDate),
        notes: initialData.notes || ''
      });
      setErrors({});
    } else {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }
  }, [initialData]);

  // Validation function
  const validateField = (name, value) => {
    let error = '';

    if (name === 'companyName') {
      if (!value || value.trim() === '') {
        error = 'Company name is required.';
      }
    }

    if (name === 'jobTitle') {
      if (!value || value.trim() === '') {
        error = 'Job title is required.';
      }
    }

    if (name === 'appliedEmail') {
      if (value && value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          error = 'Please enter a valid email address (e.g. recruiter@company.com).';
        }
      }
    }

    if (name === 'jobPostingUrl' || name === 'resumeLink') {
      if (value && value.trim() !== '') {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        if (!urlRegex.test(value.trim())) {
          error = 'Please enter a valid URL (e.g. https://example.com/job).';
        }
      }
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};

    const companyErr = validateField('companyName', formData.companyName);
    if (companyErr) newErrors.companyName = companyErr;

    const titleErr = validateField('jobTitle', formData.jobTitle);
    if (titleErr) newErrors.jobTitle = titleErr;

    const emailErr = validateField('appliedEmail', formData.appliedEmail);
    if (emailErr) newErrors.appliedEmail = emailErr;

    const postingUrlErr = validateField('jobPostingUrl', formData.jobPostingUrl);
    if (postingUrlErr) newErrors.jobPostingUrl = postingUrlErr;

    const resumeLinkErr = validateField('resumeLink', formData.resumeLink);
    if (resumeLinkErr) newErrors.resumeLink = resumeLinkErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation clearance/update
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      onShowToast?.('Please resolve form errors before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateApplication(initialData._id, formData);
        onShowToast?.(`Application for ${formData.companyName} updated successfully!`, 'success');
      } else {
        await createApplication(formData);
        onShowToast?.(`Application for ${formData.companyName} added successfully!`, 'success');
        setFormData(INITIAL_FORM_STATE);
      }

      // Navigate to /applications after success
      navigate('/applications');
    } catch (err) {
      onShowToast?.(err.message || 'Failed to save application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to original values
  const handleReset = () => {
    if (isEditing && initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        jobTitle: initialData.jobTitle || '',
        status: initialData.status || 'Applied',
        jobPostingUrl: initialData.jobPostingUrl || '',
        resumeName: initialData.resumeName || '',
        resumeLink: initialData.resumeLink || '',
        appliedEmail: initialData.appliedEmail || '',
        recruiterName: initialData.recruiterName || '',
        followUpDate: formatDateForInput(initialData.followUpDate),
        notes: initialData.notes || ''
      });
      onShowToast?.('Form restored to original values.', 'success');
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setErrors({});
  };

  // Cancel edit - discard and return to /applications
  const handleCancel = () => {
    navigate('/applications');
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <div>
          <h1 className="form-title">
            {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
          </h1>
          <p className="form-subtitle">
            {isEditing
              ? 'Update the application details and save your changes.'
              : 'Keep track of your job search progress by entering position details below.'}
          </p>
        </div>
        <div className={`form-mode-badge ${isEditing ? 'editing' : ''}`}>
          <span>{isEditing ? '✏️ Edit Mode' : '✨ New Application'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1: Role Overview */}
        <div className="form-section">
          <h2 className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Job Overview
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="companyName" className="form-label">
                <span>Company Name <span className="required-star">*</span></span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="e.g. Google, Microsoft, Stripe"
                className={`form-input ${errors.companyName ? 'has-error' : ''}`}
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              {errors.companyName && (
                <div className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.companyName}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle" className="form-label">
                <span>Job Title <span className="required-star">*</span></span>
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className={`form-input ${errors.jobTitle ? 'has-error' : ''}`}
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
              {errors.jobTitle && (
                <div className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.jobTitle}</span>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="status" className="form-label">
                <span>Application Status <span className="required-star">*</span></span>
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Links & Follow-up */}
        <div className="form-section">
          <h2 className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Links & Follow-up Date
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="followUpDate" className="form-label">
                <span>Follow-up Date</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                className="form-input"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobPostingUrl" className="form-label">
                <span>Job Posting URL</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="jobPostingUrl"
                name="jobPostingUrl"
                type="url"
                placeholder="https://company.com/careers/123"
                className={`form-input ${errors.jobPostingUrl ? 'has-error' : ''}`}
                value={formData.jobPostingUrl}
                onChange={handleChange}
              />
              {errors.jobPostingUrl && (
                <div className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.jobPostingUrl}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="resumeName" className="form-label">
                <span>Resume Name / Version</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="resumeName"
                name="resumeName"
                type="text"
                placeholder="e.g. Frontend-Resume-2026.pdf"
                className="form-input"
                value={formData.resumeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="resumeLink" className="form-label">
                <span>Resume Link</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="resumeLink"
                name="resumeLink"
                type="url"
                placeholder="https://drive.google.com/your-resume-link"
                className={`form-input ${errors.resumeLink ? 'has-error' : ''}`}
                value={formData.resumeLink}
                onChange={handleChange}
              />
              {errors.resumeLink && (
                <div className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.resumeLink}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Notes */}
        <div className="form-section">
          <h2 className="form-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Contact & Application Notes
          </h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="recruiterName" className="form-label">
                <span>Recruiter / Contact Person</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="recruiterName"
                name="recruiterName"
                type="text"
                placeholder="e.g. Jane Doe"
                className="form-input"
                value={formData.recruiterName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appliedEmail" className="form-label">
                <span>Applied Email</span>
                <span className="optional-tag">Optional</span>
              </label>
              <input
                id="appliedEmail"
                name="appliedEmail"
                type="email"
                placeholder="recruiter@company.com"
                className={`form-input ${errors.appliedEmail ? 'has-error' : ''}`}
                value={formData.appliedEmail}
                onChange={handleChange}
              />
              {errors.appliedEmail && (
                <div className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.appliedEmail}</span>
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes" className="form-label">
                <span>Notes & Interview Logs</span>
                <span className="optional-tag">Optional</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Log interview rounds, salary expectations, tech stack questions, or referral details..."
                className="form-textarea"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Application...' : 'Save Application'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
