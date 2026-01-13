// API Configuration for NHC Langata
// This file centralizes all API endpoint configurations

// Get the base URL from environment variable or use a default for development
// In production, set VITE_N8N_WEBHOOK_URL in your .env file
const getBaseUrl = () => {
  // Your n8n instance base URL
  return 'https://n8n.tenear.com/webhook';
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  residentLogin: `${getBaseUrl()}/nhc-login`,
  
  // Resident Operations
  getResidents: `${getBaseUrl()}/nhc-residents`,
  updateResident: `${getBaseUrl()}/nhc-update-resident`,
  
  // Vacant Houses Operations
  getVacantHouses: `${getBaseUrl()}/nhc-vacant-houses`,
  
  // Complaint/Issue Operations
  submitComplaint: `${getBaseUrl()}/nhc-submit-complaint`,
  getComplaints: `${getBaseUrl()}/nhc-complaints`,
  
  // Payment Operations  
  getBills: `${getBaseUrl()}/nhc-bills`,
  processPayment: `${getBaseUrl()}/nhc-process-payment`,
  getPaymentHistory: `${getBaseUrl()}/nhc-payment-history`,
  
  // Announcement Operations
  getAnnouncements: `${getBaseUrl()}/nhc-announcements`,

  // Chat Operations
  sendChatMessage: `${getBaseUrl()}/nhc-chat`,

  // Opinion/Feedback Operations
  submitOpinion: `${getBaseUrl()}/nhc-submit-opinion`,
  getNotices: `${getBaseUrl()}/nhc-notices`,
};

// Webhook paths (for reference)
export const WEBHOOK_PATHS = {
  residentLogin: 'nhc-login',
  getResidents: 'nhc-residents',
  updateResident: 'nhc-update-resident',
  getVacantHouses: 'nhc-vacant-houses',
  submitComplaint: 'nhc-submit-complaint',
  getComplaints: 'nhc-complaints',
  getBills: 'nhc-bills',
  processPayment: 'nhc-process-payment',
  getPaymentHistory: 'nhc-payment-history',
  getAnnouncements: 'nhc-announcements',
};

export default {
  API_ENDPOINTS,
  WEBHOOK_PATHS,
  getBaseUrl
};
