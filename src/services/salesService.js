// salesService.js
import { getOrders } from './orderService';

// Get sales data for a specific date
export const getSalesForDate = (date) => {
  const targetDate = new Date(date);
  const dateString = targetDate.toISOString().split('T')[0];
  
  const orders = getOrders();
  const salesForDate = orders.filter(order => {
    const orderDate = new Date(order.timestamp || order.date);
    return orderDate.toISOString().split('T')[0] === dateString;
  });
  
  // Calculate total sales amount
  const totalSales = salesForDate.reduce((total, order) => {
    // Skip fully refunded orders
    if (order.status === 'refunded') return total;
    
    // For partial refunds, subtract the refunded amount
    if (order.status === 'partial-refunded' && order.refunds) {
      const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      return total + (order.total - refundedAmount);
    }
    
    return total + order.total;
  }, 0);
  
  // Get unique customers
  const uniqueCustomers = new Set();
  salesForDate.forEach(order => {
    if (order.customerId) {
      uniqueCustomers.add(order.customerId);
    } else if (order.customer && order.customer !== 'Walk in customer') {
      uniqueCustomers.add(order.customer);
    }
  });
  
  // Calculate average order value
  const averageOrder = salesForDate.length > 0 ? totalSales / salesForDate.length : 0;
  
  return {
    date: dateString,
    totalSales,
    orderCount: salesForDate.length,
    customerCount: uniqueCustomers.size,
    averageOrder
  };
};

// Get sales comparison between current period and previous period
export const getSalesComparison = (period = 'day') => {
  const today = new Date();
  let currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd;
  
  if (period === 'day') {
    // Current day vs previous day
    currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    currentPeriodEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
    previousPeriodEnd = new Date(currentPeriodEnd);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
  } else if (period === 'week') {
    // Current week vs previous week
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    
    currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), diff, 0, 0, 0);
    currentPeriodEnd = new Date(today);
    
    previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
    previousPeriodEnd = new Date(previousPeriodStart);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() + 6);
    previousPeriodEnd.setHours(23, 59, 59);
  } else if (period === 'month') {
    // Current month vs previous month
    currentPeriodStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    currentPeriodEnd = new Date(today);
    
    previousPeriodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
    previousPeriodEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
  }
  
  const orders = getOrders();
  
  // Filter orders for current period
  const currentPeriodOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp || order.date);
    return orderDate >= currentPeriodStart && orderDate <= currentPeriodEnd;
  });
  
  // Filter orders for previous period
  const previousPeriodOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp || order.date);
    return orderDate >= previousPeriodStart && orderDate <= previousPeriodEnd;
  });
  
  // Calculate sales for current period
  const currentPeriodSales = currentPeriodOrders.reduce((total, order) => {
    if (order.status === 'refunded') return total;
    
    if (order.status === 'partial-refunded' && order.refunds) {
      const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      return total + (order.total - refundedAmount);
    }
    
    return total + order.total;
  }, 0);
  
  // Calculate sales for previous period
  const previousPeriodSales = previousPeriodOrders.reduce((total, order) => {
    if (order.status === 'refunded') return total;
    
    if (order.status === 'partial-refunded' && order.refunds) {
      const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      return total + (order.total - refundedAmount);
    }
    
    return total + order.total;
  }, 0);
  
  // Calculate percentage change
  let percentageChange = 0;
  let isIncrease = true;
  
  if (previousPeriodSales > 0) {
    const difference = currentPeriodSales - previousPeriodSales;
    percentageChange = (difference / previousPeriodSales) * 100;
    isIncrease = difference >= 0;
  } else if (currentPeriodSales > 0) {
    percentageChange = 100;
    isIncrease = true;
  }
  
  return {
    currentPeriodSales,
    previousPeriodSales,
    percentageChange,
    isIncrease,
    orderCountCurrent: currentPeriodOrders.length,
    orderCountPrevious: previousPeriodOrders.length
  };
};

// Get hourly sales data for a specific date
export const getHourlySales = (date) => {
  const targetDate = new Date(date);
  const dateString = targetDate.toISOString().split('T')[0];
  
  const orders = getOrders();
  const hourlyData = Array(24).fill(0);
  
  orders.forEach(order => {
    const orderDate = new Date(order.timestamp || order.date);
    const orderDateString = orderDate.toISOString().split('T')[0];
    
    // Only include orders from the target date
    if (orderDateString === dateString) {
      const hour = orderDate.getHours();
      
      // Skip fully refunded orders
      if (order.status === 'refunded') return;
      
      // For partial refunds, subtract the refunded amount
      if (order.status === 'partial-refunded' && order.refunds) {
        const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
        hourlyData[hour] += (order.total - refundedAmount);
      } else {
        hourlyData[hour] += order.total;
      }
    }
  });
  
  return hourlyData;
};

// Get sales data for dashboard
export const getDashboardSalesData = () => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
  
  const orders = getOrders();
  
  // Today's sales
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp || order.date);
    return orderDate >= startOfToday && orderDate <= endOfToday;
  });
  
  const todaySales = todayOrders.reduce((total, order) => {
    if (order.status === 'refunded') return total;
    
    if (order.status === 'partial-refunded' && order.refunds) {
      const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      return total + (order.total - refundedAmount);
    }
    
    return total + order.total;
  }, 0);
  
  // Month-to-date sales
  const mtdOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp || order.date);
    return orderDate >= startOfMonth && orderDate <= today;
  });
  
  const mtdSales = mtdOrders.reduce((total, order) => {
    if (order.status === 'refunded') return total;
    
    if (order.status === 'partial-refunded' && order.refunds) {
      const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);
      return total + (order.total - refundedAmount);
    }
    
    return total + order.total;
  }, 0);
  
  // Get comparison with previous day
  const dayComparison = getSalesComparison('day');
  
  // Get comparison with previous month
  const monthComparison = getSalesComparison('month');
  
  return {
    todaySales,
    mtdSales,
    dayComparison,
    monthComparison,
    orderCount: orders.length
  };
};
