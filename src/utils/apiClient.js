// API Client Utility for NHC Langata
// Handles all HTTP requests to n8n webhooks

import { API_ENDPOINTS } from '../config/apiConfig';

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'nhclangata_current_user',
  AUTH_TOKEN: 'nhclangata_auth_token',
  RESIDENT_ID: 'nhclangata_resident_id',
};

/**
 * Generic API request handler
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} - Parsed JSON response
 */
export const apiRequest = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add timeout for slow connections
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    // Parse JSON response
    const text = await response.text();
    
    // Handle empty responses
    if (!text || text.trim() === '') {
      throw new Error('Empty response from server');
    }
    
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

/**
 * Login resident user via n8n webhook
 * @param {string} email - Resident email
 * @param {string} apartmentId - Resident apartment ID
 * @returns {Promise<object>} - User data and auth token
 */
export const loginResident = async (email, apartmentId) => {
  const response = await apiRequest(API_ENDPOINTS.residentLogin, {
    method: 'POST',
    body: JSON.stringify({ 
      email, 
      apartment_id: apartmentId 
    }),
  });

  // Validate response structure
  if (!response || !response.id) {
    throw new Error('Invalid response from server');
  }

  // Store auth data
  const userData = {
    id: response.id,
    first_name: response.first_name,
    last_name: response.last_name,
    email: response.email,
    phone: response.phone,
    apartment_id: response.apartment_id,
    resident_type: response.resident_type, // Add this!
    // Apartment details from joined query
    apartment_number: response.apartment_number,
    block_name: response.block_name,
    phase_name: response.phase_name,
  };

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  localStorage.setItem(STORAGE_KEYS.RESIDENT_ID, response.id);

  return { user: userData, token: response.token || 'api_token' };
};

/**
 * Get vacant houses data
 * @returns {Promise<object>} - Object with total_vacant, vacant_by_phase array, and apartments array
 */
export const getVacantHouses = async () => {
  const response = await apiRequest(API_ENDPOINTS.getVacantHouses, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  // Validate response structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  // Return the structured data
  return {
    total_vacant: response.total_vacant || 0,
    vacant_by_phase: response.vacant_by_phase || [],
    apartments: response.apartments || [],
  };
};

/**
 * Get payment history and balance for a resident
 * @param {number} residentId - The resident's ID
 * @returns {Promise<object>} - Object with payment history and balance summary
 */
export const getPaymentHistory = async (residentId) => {
  const response = await apiRequest(API_ENDPOINTS.getPaymentHistory, {
    method: 'POST',
    body: JSON.stringify({ resident_id: residentId }),
  });

  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  return {
    resident_id: response.resident_id,
    resident_name: response.resident_name,
    house_number: response.house_number,
    phase: response.phase,
    monthly_rate: response.monthly_rate || 200,
    months_count: response.months_count || 0,
    total_dues: response.total_dues || 0,
    total_paid: response.total_paid || 0,
    outstanding_balance: response.outstanding_balance || 0,
    payment_history: response.payment_history || [],
  };
};

/**
 * Trigger M-Pesa STK Push for payment
 * @param {number} residentId - The resident's ID
 * @param {string} phoneNumber - M-Pesa phone number
 * @param {number} amount - Payment amount (Kshs)
 * @returns {Promise<object>} - Response with checkout request ID
 */
export const initiateSTKPush = async (residentId, phoneNumber, amount) => {
  const response = await apiRequest(API_ENDPOINTS.initiateSTKPush, {
    method: 'POST',
    body: JSON.stringify({
      resident_id: residentId,
      phone_number: phoneNumber,
      amount: amount,
    }),
  });

  return response;
};

/**
 * Check payment status by checkout request ID
 * @param {string} checkoutRequestId - The checkout request ID from STK push
 * @returns {Promise<object>} - Payment status object
 */
export const checkPaymentStatus = async (checkoutRequestId) => {
  const response = await apiRequest(API_ENDPOINTS.checkPaymentStatus, {
    method: 'POST',
    body: JSON.stringify({ checkout_request_id: checkoutRequestId }),
  });

  return response;
};

/**
 * Record a manual payment (fallback option)
 * @param {number} residentId - The resident's ID
 * @param {number} amount - Payment amount (Kshs)
 * @param {string} transactionCode - M-Pesa transaction code
 * @returns {Promise<object>} - Response with success status
 */
export const recordPayment = async (residentId, amount, transactionCode) => {
  const response = await apiRequest(API_ENDPOINTS.recordPayment, {
    method: 'POST',
    body: JSON.stringify({
      resident_id: residentId,
      amount: amount,
      transaction_code: transactionCode,
    }),
  });

  return response;
};

/**
 * Get the stored resident ID
 * @returns {string|null} - Resident ID or null
 */
export const getStoredResidentId = () => {
  return localStorage.getItem(STORAGE_KEYS.RESIDENT_ID);
};

/**
 * Get the stored current user
 * @returns {object|null} - User object or null
 */
export const getStoredUser = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.RESIDENT_ID);
};

/**
 * Get active shops for Sokoni (Market Place)
 * @returns {Promise<Array>} - Array of shop objects with id, name, and description
 */
export const getActiveShops = async () => {
  const response = await apiRequest(API_ENDPOINTS.getActiveShops, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  // Validate response structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  // Return the shops array, defaulting to empty array if not present
  return response.shops || response.data || [];
};

/**
 * Get broadcasts for the logged-in user
 * @returns {Promise<Array>} - Array of broadcast objects
 */
export const getBroadcasts = async () => {
  const residentId = getStoredResidentId();
  if (!residentId) {
    throw new Error('User not logged in');
  }

  const response = await apiRequest(API_ENDPOINTS.getBroadcasts, {
    method: 'POST',
    body: JSON.stringify({ resident_id: parseInt(residentId) }),
  });

  // Validate response structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  // Handle different response formats
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response.broadcasts && Array.isArray(response.broadcasts)) {
    return response.broadcasts;
  }
  
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  console.warn('Unexpected broadcasts format:', response);
  return [];
};

/**
 * Get count of unread broadcasts for the user
 * @returns {Promise<number>} - Count of unread broadcasts
 */
export const getUnreadBroadcastsCount = async () => {
  const residentId = getStoredResidentId();
  if (!residentId) {
    return 0;
  }

  try {
    const broadcasts = await getBroadcasts();
    const unreadCount = broadcasts.filter(b => !b.read_status).length;
    return unreadCount;
  } catch (error) {
    console.error('Error getting unread broadcasts count:', error);
    return 0;
  }
};

/**
 * Mark a broadcast as read
 * @param {number} broadcastId - The broadcast ID to mark as read
 * @returns {Promise<object>} - Response from server
 */
export const markBroadcastRead = async (broadcastId) => {
  const residentId = getStoredResidentId();
  if (!residentId) {
    throw new Error('User not logged in');
  }

  const response = await apiRequest(API_ENDPOINTS.markBroadcastRead, {
    method: 'POST',
    body: JSON.stringify({
      broadcast_id: broadcastId,
      resident_id: parseInt(residentId),
    }),
  });

  return response;
};

/**
 * Create a new broadcast (admin only)
 * @param {object} broadcastData - The broadcast data
 * @returns {Promise<object>} - Response from server
 */
export const createBroadcast = async (broadcastData) => {
  const user = getStoredUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  const response = await apiRequest(API_ENDPOINTS.createBroadcast, {
    method: 'POST',
    body: JSON.stringify({
      sender_id: parseInt(user.id),
      sender_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
      sender_role: user.resident_type || user.role || 'user', // Include role for N8N verification
      title: broadcastData.title,
      content: broadcastData.content,
      recipient_type: broadcastData.recipientType,
      recipient_value: broadcastData.recipientValue || null,
    }),
  });

  return response;
};

/**
 * Get all phases for filtering (admin only)
 * @returns {Promise<Array>} - Array of phase objects
 */
export const getPhases = async () => {
  const response = await apiRequest(API_ENDPOINTS.getPhases, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  return response.phases || response.data || [];
};

/**
 * Get all blocks for filtering (admin only)
 * @returns {Promise<Array>} - Array of block objects
 */
export const getBlocks = async () => {
  const response = await apiRequest(API_ENDPOINTS.getBlocks, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response from server');
  }

  return response.blocks || response.data || [];
};

export default {
  apiRequest,
  loginResident,
  getVacantHouses,
  getPaymentHistory,
  initiateSTKPush,
  checkPaymentStatus,
  recordPayment,
  getStoredResidentId,
  getStoredUser,
  clearAuthData,
  getActiveShops,
  getBroadcasts,
  getUnreadBroadcastsCount,
  markBroadcastRead,
  createBroadcast,
  getPhases,
  getBlocks,
  STORAGE_KEYS,
};
