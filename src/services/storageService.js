// storageService.js
// A utility service for handling localStorage operations with error handling and serialization

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @param {any} defaultValue - Default value to return if key doesn't exist
 * @returns {any} The parsed data or defaultValue if not found
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set data in localStorage
 * @param {string} key - The key to set in localStorage
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all data from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - The key to check
 * @returns {boolean} True if key exists, false otherwise
 */
export const hasLocalStorage = (key) => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking if ${key} exists in localStorage:`, error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of keys
 */
export const getLocalStorageKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Get the size of localStorage in bytes
 * @returns {number} Size in bytes
 */
export const getLocalStorageSize = () => {
  try {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      size += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
    }
    return size;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
};
