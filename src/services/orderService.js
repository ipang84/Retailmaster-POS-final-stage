// Order Service
// This service handles order-related operations

// Get all orders from localStorage
export const getOrders = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [
    // Default orders for demo
    {
      id: 'ORD-1001',
      date: '2023-04-15',
      timestamp: '2023-04-15T14:30:00Z',
      customer: 'John Smith',
      customerId: 'c1',
      items: [
        {
          id: 'p1',
          name: 'Smartphone X',
          price: 599.99,
          quantity: 1,
          sku: 'SP-X-001'
        },
        {
          id: 'p5',
          name: 'Bluetooth Speaker',
          price: 79.99,
          quantity: 1,
          sku: 'BS-S-005'
        }
      ],
      itemCount: 2,
      subtotal: 679.98,
      discount: 0,
      tax: 60.35,
      total: 740.33,
      payment: {
        method: 'credit_card',
        cardType: 'Visa',
        last4: '4242'
      },
      notes: '',
      tags: [],
      status: 'completed'
    },
    {
      id: 'ORD-1002',
      date: '2023-04-16',
      timestamp: '2023-04-16T10:15:00Z',
      customer: 'Jane Doe',
      customerId: 'c2',
      items: [
        {
          id: 'p8',
          name: 'Running Shoes',
          price: 89.99,
          quantity: 1,
          sku: 'RS-9-008'
        }
      ],
      itemCount: 1,
      subtotal: 89.99,
      discount: 0,
      tax: 7.99,
      total: 97.98,
      payment: {
        method: 'cash',
        amountTendered: 100,
        changeGiven: 2.02
      },
      notes: '',
      tags: [],
      status: 'completed'
    },
    {
      id: 'ORD-1003',
      date: '2023-04-17',
      timestamp: '2023-04-17T16:45:00Z',
      customer: 'Robert Johnson',
      customerId: 'c3',
      items: [
        {
          id: 'p4',
          name: 'Laptop Pro',
          price: 1299.99,
          quantity: 1,
          sku: 'LP-X-004'
        },
        {
          id: 'p2',
          name: 'Wireless Earbuds',
          price: 129.99,
          quantity: 1,
          sku: 'WE-B-002'
        },
        {
          id: 'p5',
          name: 'Bluetooth Speaker',
          price: 79.99,
          quantity: 1,
          sku: 'BS-S-005'
        }
      ],
      itemCount: 3,
      subtotal: 1509.97,
      discount: 150.99,
      tax: 120.53,
      total: 1479.51,
      payment: {
        method: 'credit_card',
        cardType: 'Mastercard',
        last4: '5678'
      },
      notes: 'Corporate purchase',
      tags: ['corporate', 'tax-exempt'],
      status: 'completed'
    },
    {
      id: 'ORD-1004',
      date: '2023-04-18',
      timestamp: '2023-04-18T09:30:00Z',
      customer: 'Sarah Williams',
      customerId: 'c4',
      items: [
        {
          id: 'p9',
          name: 'Coffee Maker',
          price: 69.99,
          quantity: 1,
          sku: 'CM-D-009'
        },
        {
          id: 'p10',
          name: 'Blender',
          price: 49.99,
          quantity: 1,
          sku: 'BL-P-010'
        }
      ],
      itemCount: 2,
      subtotal: 119.98,
      discount: 0,
      tax: 10.65,
      total: 130.63,
      payment: {
        method: 'debit_card',
        cardType: 'Visa Debit',
        last4: '9012'
      },
      notes: '',
      tags: [],
      status: 'completed'
    },
    {
      id: 'ORD-1005',
      date: '2023-04-18',
      timestamp: '2023-04-18T14:20:00Z',
      customer: 'Michael Brown',
      customerId: 'c5',
      items: [
        {
          id: 'p6',
          name: 'Casual T-Shirt',
          price: 24.99,
          quantity: 5,
          sku: 'CT-M-006'
        },
        {
          id: 'p7',
          name: 'Denim Jeans',
          price: 49.99,
          quantity: 3,
          sku: 'DJ-L-007'
        }
      ],
      itemCount: 8,
      subtotal: 274.92,
      discount: 27.49,
      tax: 21.96,
      total: 269.39,
      payment: {
        method: 'credit_card',
        cardType: 'Amex',
        last4: '3456'
      },
      notes: 'Wholesale order',
      tags: ['wholesale', 'bulk'],
      status: 'completed'
    }
  ];
};

// Save a new order to localStorage
export const saveOrder = (order) => {
  const orders = getOrders();
  const updatedOrders = [order, ...orders];
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  return order;
};

// Update an existing order
export const updateOrder = (orderId, updatedData) => {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === orderId 
      ? { ...order, ...updatedData } 
      : order
  );
  
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  
  return updatedOrders.find(order => order.id === orderId);
};

// Delete an order
export const deleteOrder = (orderId) => {
  const orders = getOrders();
  const updatedOrders = orders.filter(order => order.id !== orderId);
  
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  
  return updatedOrders;
};

// Get a single order by ID
export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// Get orders by customer ID
export const getOrdersByCustomer = (customerId) => {
  const orders = getOrders();
  return orders.filter(order => order.customerId === customerId);
};

// Get orders by date range
export const getOrdersByDateRange = (startDate, endDate) => {
  const orders = getOrders();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= start && orderDate <= end;
  });
};

// Get orders by status
export const getOrdersByStatus = (status) => {
  const orders = getOrders();
  return orders.filter(order => order.status === status);
};

// Get today's orders
export const getTodaysOrders = () => {
  const orders = getOrders();
  const today = new Date().toISOString().split('T')[0];
  
  return orders.filter(order => order.date === today);
};

// Get recent orders (last 7 days)
export const getRecentOrders = () => {
  const orders = getOrders();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= sevenDaysAgo;
  });
};

// Calculate total sales
export const calculateTotalSales = (ordersList = null) => {
  const orders = ordersList || getOrders();
  return orders.reduce((total, order) => total + order.total, 0);
};

// Calculate average order value
export const calculateAverageOrderValue = (ordersList = null) => {
  const orders = ordersList || getOrders();
  if (orders.length === 0) return 0;
  
  const totalSales = calculateTotalSales(orders);
  return totalSales / orders.length;
};

// Get top selling products
export const getTopSellingProducts = (limit = 5) => {
  const orders = getOrders();
  const productSales = {};
  
  // Count sales for each product
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productSales[item.id]) {
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      } else {
        productSales[item.id] = {
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });
  
  // Convert to array and sort by quantity
  return Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

// Process a refund
export const processRefund = (refundData) => {
  try {
    const orderId = refundData.orderId;
    const order = getOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Initialize refunds array if it doesn't exist
    if (!order.refunds) {
      order.refunds = [];
    }
    
    // Generate a unique refund ID
    const refundId = `REF-${Date.now().toString().slice(-6)}`;
    
    // Create the refund record with tax information
    const refund = {
      id: refundId,
      ...refundData,
      timestamp: new Date().toISOString(),
      // Ensure tax information is included
      subtotal: refundData.subtotal || 0,
      tax: refundData.tax || 0,
      amount: refundData.amount || 0
    };
    
    // Add the refund to the order's refunds array
    order.refunds.push(refund);
    
    // Determine if this is a full or partial refund
    const totalRefunded = getTotalRefundedAmount(orderId);
    const isFullRefund = Math.abs(totalRefunded - order.total) < 0.01; // Allow for small rounding differences
    
    // Update order status
    if (isFullRefund) {
      order.status = 'refunded';
    } else {
      order.status = 'partial-refunded';
    }
    
    // Update the order in localStorage
    updateOrder(orderId, order);
    
    // Return success with additional info
    return {
      success: true,
      refundId,
      inventoryUpdated: true,
      order
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

// Calculate remaining balance for an order
export const getRemainingBalance = (order) => {
  // For completed orders that haven't been refunded yet, 
  // the remaining balance should be the total order amount
  if (order.status === 'completed') {
    return order.total || 0;
  }
  
  // If the order is already refunded or partially refunded
  if (order.refunds && order.refunds.length > 0) {
    const totalRefunded = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
    return Math.max(0, (order.total || 0) - totalRefunded);
  }
  
  // Default case
  return order.total || 0;
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
  return updateOrder(orderId, { status });
};

// Update order customer
export const updateOrderCustomer = (orderId, customerName) => {
  return updateOrder(orderId, { customer: customerName });
};

// Get total refunded amount for an order
export const getTotalRefundedAmount = (orderId) => {
  const order = getOrderById(orderId);
  if (!order || !order.refunds || order.refunds.length === 0) return 0;
  
  return order.refunds.reduce((total, refund) => total + (refund.amount || 0), 0);
};

// Get total refunded tax for an order
export const getTotalRefundedTax = (orderId) => {
  const order = getOrderById(orderId);
  if (!order || !order.refunds || order.refunds.length === 0) return 0;
  
  return order.refunds.reduce((total, refund) => total + (refund.tax || 0), 0);
};

// Cancel an order
export const cancelOrder = (orderId) => {
  return updateOrderStatus(orderId, 'cancelled');
};

// Get financial data for reports and analytics
export const getFinancialData = () => {
  const orders = getOrders();
  const financialData = {};
  
  // Group orders by date
  orders.forEach(order => {
    const date = order.date;
    
    if (!financialData[date]) {
      financialData[date] = {
        date,
        sales: 0,
        refunds: 0,
        netRevenue: 0,
        orderCount: 0,
        itemCount: 0,
        paymentMethods: {}
      };
    }
    
    // Add sales data
    if (order.status === 'completed') {
      financialData[date].sales += order.total;
      financialData[date].orderCount += 1;
      financialData[date].itemCount += order.itemCount || 0;
      
      // Track payment methods
      const paymentMethod = order.payment?.method || 'unknown';
      if (!financialData[date].paymentMethods[paymentMethod]) {
        financialData[date].paymentMethods[paymentMethod] = 0;
      }
      financialData[date].paymentMethods[paymentMethod] += order.total;
    }
    
    // Add refund data
    if (order.refunds && order.refunds.length > 0) {
      const refundTotal = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      financialData[date].refunds += refundTotal;
    }
    
    // Calculate net revenue
    financialData[date].netRevenue = financialData[date].sales - financialData[date].refunds;
  });
  
  return financialData;
};
