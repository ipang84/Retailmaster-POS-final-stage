// Import/Export Service
// Handles importing and exporting data in various formats

/**
 * Convert products array to CSV string
 * @param {Array} products - Array of product objects
 * @returns {string} CSV formatted string
 */
export const productsToCSV = (products) => {
  if (!products || !products.length) return '';
  
  // Define CSV headers based on product properties
  const headers = [
    'id', 'name', 'description', 'price', 'cost', 'inventory', 
    'status', 'category', 'vendor', 'sku', 'barcode', 
    'tags', 'minStock', 'condition'
  ];
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add product rows
  products.forEach(product => {
    const row = headers.map(header => {
      let value = product[header];
      
      // Handle special cases
      if (header === 'tags' && Array.isArray(value)) {
        value = value.join('|'); // Use pipe as separator for tags
      }
      
      // Convert to string and handle commas and quotes
      if (value === null || value === undefined) {
        return '';
      } else {
        value = String(value);
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (value.includes(',') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
    });
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Parse CSV string to products array
 * @param {string} csv - CSV formatted string
 * @returns {Array} Array of product objects
 */
export const csvToProducts = (csv) => {
  if (!csv) return [];
  
  // Split into rows
  const rows = csv.split(/\r?\n/);
  if (rows.length < 2) return []; // Need at least header and one data row
  
  // Parse headers
  const headers = parseCSVRow(rows[0]);
  
  // Parse data rows
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue; // Skip empty rows
    
    const values = parseCSVRow(rows[i]);
    if (values.length !== headers.length) {
      console.error(`Row ${i} has ${values.length} values, expected ${headers.length}`);
      continue; // Skip invalid rows
    }
    
    // Create product object
    const product = {};
    headers.forEach((header, index) => {
      let value = values[index];
      
      // Handle special cases
      if (header === 'tags' && value) {
        value = value.split('|').map(tag => tag.trim()); // Split tags by pipe
      } else if (header === 'price' || header === 'cost') {
        value = parseFloat(value) || 0;
      } else if (header === 'inventory' || header === 'minStock') {
        value = value === '' ? null : (parseInt(value) || 0);
      }
      
      product[header] = value;
    });
    
    products.push(product);
  }
  
  return products;
};

/**
 * Convert customers array to CSV string
 * @param {Array} customers - Array of customer objects
 * @returns {string} CSV formatted string
 */
export const customersToCSV = (customers) => {
  if (!customers || !customers.length) return '';
  
  // Define CSV headers based on customer properties
  const headers = [
    'id', 'fullName', 'email', 'phone', 'companyName', 'address', 
    'city', 'state', 'zipCode', 'country', 'notes', 'createdAt'
  ];
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add customer rows
  customers.forEach(customer => {
    const row = headers.map(header => {
      let value = customer[header];
      
      // Convert to string and handle commas and quotes
      if (value === null || value === undefined) {
        return '';
      } else {
        value = String(value);
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (value.includes(',') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
    });
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Parse CSV string to customers array
 * @param {string} csv - CSV formatted string
 * @returns {Array} Array of customer objects
 */
export const csvToCustomers = (csv) => {
  if (!csv) return [];
  
  // Split into rows
  const rows = csv.split(/\r?\n/);
  if (rows.length < 2) return []; // Need at least header and one data row
  
  // Parse headers
  const headers = parseCSVRow(rows[0]);
  
  // Parse data rows
  const customers = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue; // Skip empty rows
    
    const values = parseCSVRow(rows[i]);
    if (values.length !== headers.length) {
      console.error(`Row ${i} has ${values.length} values, expected ${headers.length}`);
      continue; // Skip invalid rows
    }
    
    // Create customer object
    const customer = {};
    headers.forEach((header, index) => {
      let value = values[index];
      
      // Handle special cases for date fields
      if (header === 'createdAt' && value) {
        // Try to parse as date, but keep as string if it fails
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          value = date.toISOString();
        }
      }
      
      customer[header] = value;
    });
    
    customers.push(customer);
  }
  
  return customers;
};

/**
 * Convert inventory items array to CSV string
 * @param {Array} items - Array of inventory item objects
 * @returns {string} CSV formatted string
 */
export const inventoryToCSV = (items) => {
  if (!items || !items.length) return '';
  
  // Define CSV headers based on inventory properties
  const headers = [
    'id', 'name', 'sku', 'category', 'cost', 'price', 
    'currentStock', 'minStock', 'supplier'
  ];
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add inventory rows
  items.forEach(item => {
    const row = headers.map(header => {
      let value = item[header];
      
      // Convert to string and handle commas and quotes
      if (value === null || value === undefined) {
        return '';
      } else {
        value = String(value);
        // Escape quotes and wrap in quotes if contains comma or quotes
        if (value.includes(',') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
    });
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Parse a CSV row, handling quoted values with commas
 * @param {string} row - CSV row
 * @returns {Array} Array of values
 */
const parseCSVRow = (row) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Double quotes inside quotes - add a single quote
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      // Normal character
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
};

/**
 * Download data as a file
 * @param {string} content - File content
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 */
export const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Read file content as text
 * @param {File} file - File object
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
