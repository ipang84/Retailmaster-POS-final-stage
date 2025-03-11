// Vendor Service
// This service handles vendor-related operations

// Get all vendors from localStorage
export const getVendors = () => {
  const vendors = localStorage.getItem('vendors');
  return vendors ? JSON.parse(vendors) : [
    // Default vendors for demo
    {
      id: 'v1',
      name: 'TechCorp',
      contactName: 'John Smith',
      email: 'john@techcorp.com',
      phone: '555-123-4567',
      address: '123 Tech St, San Francisco, CA 94107',
      notes: 'Primary supplier for electronics',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'v2',
      name: 'AudioTech',
      contactName: 'Sarah Johnson',
      email: 'sarah@audiotech.com',
      phone: '555-987-6543',
      address: '456 Audio Ave, Los Angeles, CA 90001',
      notes: 'Audio equipment supplier',
      createdAt: '2023-01-02T00:00:00Z'
    },
    {
      id: 'v3',
      name: 'ComputeTech',
      contactName: 'Michael Brown',
      email: 'michael@computetech.com',
      phone: '555-456-7890',
      address: '789 Computer Blvd, Seattle, WA 98101',
      notes: 'Computer hardware supplier',
      createdAt: '2023-01-03T00:00:00Z'
    },
    {
      id: 'v4',
      name: 'FashionCo',
      contactName: 'Emily Davis',
      email: 'emily@fashionco.com',
      phone: '555-789-0123',
      address: '321 Fashion St, New York, NY 10001',
      notes: 'Clothing and apparel supplier',
      createdAt: '2023-01-04T00:00:00Z'
    },
    {
      id: 'v5',
      name: 'HomeGoods',
      contactName: 'David Wilson',
      email: 'david@homegoods.com',
      phone: '555-321-6547',
      address: '654 Home Rd, Chicago, IL 60601',
      notes: 'Home and kitchen supplier',
      createdAt: '2023-01-05T00:00:00Z'
    },
    {
      id: 'v6',
      name: 'SportGear',
      contactName: 'Jessica Martinez',
      email: 'jessica@sportgear.com',
      phone: '555-654-9870',
      address: '987 Sport Ct, Denver, CO 80201',
      notes: 'Sports equipment supplier',
      createdAt: '2023-01-06T00:00:00Z'
    }
  ];
};

// Add a new vendor
export const addVendor = (vendor) => {
  const vendors = getVendors();
  
  // Generate a unique ID if not provided
  const newVendor = {
    ...vendor,
    id: vendor.id || `v-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  const updatedVendors = [...vendors, newVendor];
  localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  
  return newVendor;
};

// Update an existing vendor
export const updateVendor = (vendorId, updatedData) => {
  const vendors = getVendors();
  const updatedVendors = vendors.map(vendor => 
    vendor.id === vendorId 
      ? { ...vendor, ...updatedData } 
      : vendor
  );
  
  localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  
  return updatedVendors.find(vendor => vendor.id === vendorId);
};

// Delete a vendor
export const deleteVendor = (vendorId) => {
  const vendors = getVendors();
  const updatedVendors = vendors.filter(vendor => vendor.id !== vendorId);
  
  localStorage.setItem('vendors', JSON.stringify(updatedVendors));
  
  return updatedVendors;
};

// Get a single vendor by ID
export const getVendorById = (vendorId) => {
  const vendors = getVendors();
  return vendors.find(vendor => vendor.id === vendorId);
};

// Get vendor name by ID
export const getVendorName = (vendorId) => {
  const vendor = getVendorById(vendorId);
  return vendor ? vendor.name : 'Unknown Vendor';
};

// Search vendors by name or contact
export const searchVendors = (query) => {
  if (!query) return [];
  
  const vendors = getVendors();
  const lowerCaseQuery = query.toLowerCase();
  
  return vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(lowerCaseQuery) ||
    (vendor.contactName && vendor.contactName.toLowerCase().includes(lowerCaseQuery)) ||
    (vendor.email && vendor.email.toLowerCase().includes(lowerCaseQuery))
  );
};

// Check if a vendor exists by name
export const vendorExists = (vendorName) => {
  const vendors = getVendors();
  return vendors.some(vendor => 
    vendor.name.toLowerCase() === vendorName.toLowerCase()
  );
};

// Get products from a specific vendor
export const getVendorProducts = (vendorId) => {
  // This would typically query the products service
  // For now, we'll return a placeholder
  return [];
};
