/**
 * Authentication Utilities
 * Provides helper functions for user authentication and role-based access control
 */

import { STORAGE_KEYS } from './apiClient';

/**
 * Get the currently stored user from localStorage
 * @returns {object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
};

/**
 * Check if the current user is an admin
 * Supports both 'role' and 'resident_type' fields from database
 * @returns {boolean} True if user is admin, false otherwise
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Check for 'role' or 'resident_type' property set to 'admin'
  // Also supports 'isAdmin' boolean flag for flexibility
  return user.role === 'admin' || user.resident_type === 'admin' || user.isAdmin === true;
};

/**
 * Check if user is authenticated (logged in)
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Get user display name
 * @returns {string} User's full name or email
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  if (!user) return 'Guest';
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.email || 'User';
};

export default {
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  getUserDisplayName,
};
