// settingsService.js
import { getLocalStorage, setLocalStorage } from './storageService';

const SETTINGS_KEY = 'store_settings';

// Default settings
const defaultSettings = {
  storeInfo: {
    name: '1XB Mobile Repair',
    email: 'ixb770mobile@gmail.com',
    phone: '',
    address: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '15:00' },
      sunday: { open: '', close: '' }
    }
  },
  taxSettings: {
    enableTax: true,
    taxRate: 8.25,
    taxInclusive: false,
    applyToShipping: true
  },
  paymentMethods: {
    cash: true,
    creditCard: true,
    debitCard: true,
    check: false,
    paypal: false,
    venmo: false,
    applePay: false,
    googlePay: false
  },
  notifications: {
    lowStock: true,
    newOrders: true,
    customerReturns: true,
    dailySummary: false
  },
  appearance: {
    theme: 'light',
    accentColor: '#0066ff',
    compactMode: false
  }
};

/**
 * Get all settings or a specific section
 * @param {string} section - Optional section name to retrieve
 * @returns {object} The requested settings
 */
export const getSettings = (section = null) => {
  const settings = getLocalStorage(SETTINGS_KEY, defaultSettings);
  
  if (section && settings[section]) {
    return settings[section];
  }
  
  return settings;
};

/**
 * Update settings
 * @param {string} section - The section to update
 * @param {object} data - The new data for the section
 * @returns {boolean} Success status
 */
export const updateSettings = (section, data) => {
  try {
    const currentSettings = getSettings();
    
    // Update the specified section
    const updatedSettings = {
      ...currentSettings,
      [section]: {
        ...currentSettings[section],
        ...data
      }
    };
    
    // Save to localStorage
    return setLocalStorage(SETTINGS_KEY, updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
};

/**
 * Reset settings to default values
 * @param {string} section - Optional section to reset
 * @returns {boolean} Success status
 */
export const resetSettings = (section = null) => {
  try {
    if (section) {
      // Reset only the specified section
      const currentSettings = getSettings();
      const updatedSettings = {
        ...currentSettings,
        [section]: defaultSettings[section]
      };
      return setLocalStorage(SETTINGS_KEY, updatedSettings);
    } else {
      // Reset all settings
      return setLocalStorage(SETTINGS_KEY, defaultSettings);
    }
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
};
