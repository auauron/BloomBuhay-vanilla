// API_BASE_URL is injected at build time via webpack DefinePlugin
// In production, REACT_BACKEND_URL env var should be set
// Fallback to production API URL if not set
export const API_BASE_URL = 
  (typeof process !== 'undefined' && process.env?.REACT_BACKEND_URL) || 
  'https://bloombuhay-vanilla-backend.onrender.com';
