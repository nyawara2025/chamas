// API Configuration for NHC Langata
// This file centralizes all API endpoint configurations

// Get the base URL from environment variable or use a default for development
// In production, set VITE_N8N_WEBHOOK_URL in your .env file
const getBaseUrl = () => {
  // Your n8n instance base URL
  return import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.tenear.com/webhook';
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
  getPaymentHistory: `${getBaseUrl()}/nhc-payment-history`,
  initiateSTKPush: `${getBaseUrl()}/nhc-stk-push`,
  checkPaymentStatus: `${getBaseUrl()}/nhc-payment-status`,
  recordPayment: `${getBaseUrl()}/nhc-record-payment`,
  
  // Announcement Operations
  getAnnouncements: `${getBaseUrl()}/nhc-announcements`,

  // Chat Operations
  sendChatMessage: `${getBaseUrl()}/nhc-chat`,

  // Opinion/Feedback Operations
  submitOpinion: `${getBaseUrl()}/nhc-submit-opinion`,
  getNotices: `${getBaseUrl()}/nhc-notices`,

  // Sokoni (Market Place) Operations
  getActiveShops: `${getBaseUrl()}/nhc-active-shops`,

  // Broadcast Operations
  getBroadcasts: `${getBaseUrl()}/nhc-broadcasts`,
  createBroadcast: `${getBaseUrl()}/nhc-create-broadcast`,
  markBroadcastRead: `${getBaseUrl()}/nhc-broadcast-read`,
  getPhases: `${getBaseUrl()}/nhc-phases`,
  getBlocks: `${getBaseUrl()}/nhc-blocks`,

  // M-Pesa Callback
  paymentCallback: `${getBaseUrl()}/nhc-payment-callback`,
};

// Webhook paths (for reference)
export const WEBHOOK_PATHS = {
  residentLogin: 'nhc-login',
  getResidents: 'nhc-residents',
  updateResident: 'nhc-update-resident',
  getVacantHouses: 'nhc-vacant-houses',
  submitComplaint: 'nhc-submit-complaint',
  getComplaints: 'nhc-complaints',
  getPaymentHistory: 'nhc-payment-history',
  initiateSTKPush: 'nhc-stk-push',
  checkPaymentStatus: 'nhc-payment-status',
  recordPayment: 'nhc-record-payment',
  getAnnouncements: 'nhc-announcements',
  paymentCallback: 'nhc-payment-callback',
  getActiveShops: 'nhc-active-shops',
  getBroadcasts: 'nhc-broadcasts',
  createBroadcast: 'nhc-create-broadcast',
  markBroadcastRead: 'nhc-broadcast-read',
  getPhases: 'nhc-phases',
  getBlocks: 'nhc-blocks',
};

// M-Pesa Configuration
// NOTE: In Vite, use import.meta.env instead of process.env
// Add these to your .env file in the project root:
// VITE_MPESA_CONSUMER_KEY=your_consumer_key
// VITE_MPESA_CONSUMER_SECRET=your_consumer_secret
// VITE_MPESA_PASSKEY=your_passkey
// VITE_MPESA_SHORTCODE=your_shortcode

export const MPESA_CONFIG = {
  // Daraja API credentials - Add to .env file when available
  consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || '',
  consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || '',
  passkey: import.meta.env.VITE_MPESA_PASSKEY || '',
  
  // Paybill details
  paybillNumber: 'NHC Welfare',
  shortcode: import.meta.env.VITE_MPESA_SHORTCODE || '000000',
  
  // Environment - 'sandbox' or 'production'
  environment: import.meta.env.VITE_MPESA_ENV || 'sandbox',
  
  // Callback URL for payment confirmations
  callbackUrl: `${getBaseUrl()}/nhc-payment-callback`,
  
  // Default payment amount
  defaultAmount: 200,
};

// M-Pesa API Endpoints (Daraja)
export const MPESA_ENDPOINTS = {
  accessToken: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  stkPush: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  stkQuery: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
};

export default {
  API_ENDPOINTS,
  WEBHOOK_PATHS,
  MPESA_CONFIG,
  MPESA_ENDPOINTS,
  getBaseUrl
};
