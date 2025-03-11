// Customer Service
// This service handles customer-related operations

// Get all customers from localStorage
export const getCustomers = () => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [
    // Default customers for demo
    {
      id: 'c1',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      companyName: 'ABC Corp',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      notes: 'Regular customer',
      createdAt: '2023-01-15T10:30:00Z',
      orders: 5,
      amountSpent: 740.33
    },
    {
      id: 'c2',
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-987-6543',
      companyName: '',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'US'
      },
      notes: 'Prefers email communication',
      createdAt: '2023-02-10T14:45:00Z',
      orders: 2,
      amountSpent: 97.98
    },
    {
      id: 'c3',
      fullName: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '555-456-7890',
      companyName: 'XYZ Industries',
      address: {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'US'
      },
      notes: 'Corporate account',
      createdAt: '2023-02-20T09:15:00Z',
      orders: 3,
      amountSpent: 1479.51
    },
    {
      id: 'c4',
      fullName: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '555-789-0123',
      companyName: '',
      address: {
        street: '321 Maple Rd',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'US'
      },
      notes: '',
      createdAt: '2023-03-05T16:20:00Z',
      orders: 1,
      amountSpent: 130.63
    },
    {
      id: 'c5',
      fullName: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '555-321-6547',
      companyName: 'Brown Enterprises',
      address: {
        street: '654 Cedar Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'US'
      },
      notes: 'Wholesale customer',
      createdAt: '2023-03-15T11:10:00Z',
      orders: 4,
      amountSpent: 269.39
    }
  ];
};

// Add a new customer
export const addCustomer = (customer) => {
  const customers = getCustomers();
  
  // Generate a unique ID if not provided
  const newCustomer = {
    ...customer,
    id: customer.id || `c-${Date.now()}`,
    createdAt: customer.createdAt || new Date().toISOString(),
    orders: customer.orders || 0,
    amountSpent: customer.amountSpent || 0
  };
  
  const updatedCustomers = [...customers, newCustomer];
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  
  return newCustomer;
};

// Update an existing customer
export const updateCustomer = (customerId, updatedData) => {
  const customers = getCustomers();
  const updatedCustomers = customers.map(customer => 
    customer.id === customerId 
      ? { ...customer, ...updatedData } 
      : customer
  );
  
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  
  return updatedCustomers.find(customer => customer.id === customerId);
};

// Delete a customer
export const deleteCustomer = (customerId) => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(customer => customer.id !== customerId);
  
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  
  return updatedCustomers;
};

// Get a single customer by ID
export const getCustomerById = (customerId) => {
  const customers = getCustomers();
  return customers.find(customer => customer.id === customerId);
};

// Search customers by name, email, or phone
export const searchCustomers = (query) => {
  if (!query) return [];
  
  const customers = getCustomers();
  const lowerCaseQuery = query.toLowerCase();
  
  return customers.filter(customer => 
    customer.fullName.toLowerCase().includes(lowerCaseQuery) ||
    (customer.email && customer.email.toLowerCase().includes(lowerCaseQuery)) ||
    (customer.phone && customer.phone.includes(query)) ||
    (customer.companyName && customer.companyName.toLowerCase().includes(lowerCaseQuery))
  );
};

// Get top customers by amount spent
export const getTopCustomers = (limit = 5) => {
  const customers = getCustomers();
  
  return customers
    .sort((a, b) => b.amountSpent - a.amountSpent)
    .slice(0, limit);
};

// Get new customers (last 30 days)
export const getNewCustomers = () => {
  const customers = getCustomers();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return customers.filter(customer => {
    const createdDate = new Date(customer.createdAt);
    return createdDate >= thirtyDaysAgo;
  });
};

// Update customer order stats
export const updateCustomerOrderStats = (customerId, orderAmount) => {
  const customer = getCustomerById(customerId);
  if (!customer) return null;
  
  const updatedCustomer = {
    ...customer,
    orders: (customer.orders || 0) + 1,
    amountSpent: (parseFloat(customer.amountSpent) || 0) + orderAmount
  };
  
  return updateCustomer(customerId, updatedCustomer);
};

// Get total number of customers
export const getCustomerCount = () => {
  return getCustomers().length;
};

// Import customers from CSV or JSON
export const importCustomers = (customersData) => {
  const existingCustomers = getCustomers();
  
  // Merge with existing customers, avoiding duplicates by email
  const emailMap = new Map();
  existingCustomers.forEach(customer => {
    if (customer.email) {
      emailMap.set(customer.email.toLowerCase(), customer);
    }
  });
  
  const newCustomers = [];
  
  customersData.forEach(customer => {
    if (customer.email) {
      const lowerCaseEmail = customer.email.toLowerCase();
      
      if (emailMap.has(lowerCaseEmail)) {
        // Update existing customer
        const existingCustomer = emailMap.get(lowerCaseEmail);
        const updatedCustomer = {
          ...existingCustomer,
          ...customer,
          id: existingCustomer.id // Keep the original ID
        };
        
        emailMap.set(lowerCaseEmail, updatedCustomer);
      } else {
        // Add new customer
        const newCustomer = {
          ...customer,
          id: customer.id || `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          orders: customer.orders || 0,
          amountSpent: customer.amountSpent || 0
        };
        
        emailMap.set(lowerCaseEmail, newCustomer);
        newCustomers.push(newCustomer);
      }
    } else {
      // Customer without email, just add as new
      const newCustomer = {
        ...customer,
        id: customer.id || `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        orders: customer.orders || 0,
        amountSpent: customer.amountSpent || 0
      };
      
      newCustomers.push(newCustomer);
    }
  });
  
  // Combine all customers and save
  const allCustomers = [...Array.from(emailMap.values()), ...newCustomers.filter(c => !c.email)];
  localStorage.setItem('customers', JSON.stringify(allCustomers));
  
  return {
    total: allCustomers.length,
    added: newCustomers.length,
    updated: customersData.length - newCustomers.length
  };
};

// Export customers to JSON format
export const exportCustomers = () => {
  return getCustomers();
};
