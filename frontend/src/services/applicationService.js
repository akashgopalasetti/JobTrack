import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Helper to extract clean error message from API error response
export const formatErrorMessage = (error) => {
  if (error.response) {
    // Server responded with status code outside 2xx
    return error.response.data?.message || `Server Error (${error.response.status})`;
  } else if (error.request) {
    // Request was made but no response received (server down, CORS block, network issue)
    return 'Unable to reach backend server. Please verify backend is running on port 5000.';
  } else {
    // Other error during setup
    return error.message || 'An unexpected error occurred.';
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const getApplications = async (params = {}) => {
  try {
    const response = await apiClient.get('/applications', { params });
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const getApplicationById = async (id) => {
  try {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const createApplication = async (applicationData) => {
  try {
    const response = await apiClient.post('/applications', applicationData);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const updateApplication = async (id, applicationData) => {
  try {
    const response = await apiClient.put(`/applications/${id}`, applicationData);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export const deleteApplication = async (id) => {
  try {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
};

export default {
  checkHealth,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
};
