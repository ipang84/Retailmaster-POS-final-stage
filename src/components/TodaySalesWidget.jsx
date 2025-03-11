import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';
import { getOrders, getOrdersByHour, getSalesByHour } from '../services/orderService';

// Using regular CSS instead of styled-components
const styles = {
  widgetContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '20px'
  },
  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0'
  },
  dateSelector: {
    display: 'flex',
    alignItems: 'center'
  },
  dateLabel: {
    marginRight: '8px',
    fontSize: '14px',
    color: '#666'
  },
  dateInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  summaryCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  summaryCard: (bgColor, textColor, valueColor) => ({
    backgroundColor: bgColor || '#f8f9fa',
    borderRadius: '6px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column'
  }),
  cardTitle: (textColor) => ({
    fontSize: '14px',
    color: textColor || '#666',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center'
  }),
  cardIcon: {
    marginRight: '8px'
  },
  cardValue: (valueColor) => ({
    fontSize: '24px',
    fontWeight: '600',
    color: valueColor || '#333',
    marginBottom: '8px'
  }),
  cardComparison: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px'
  },
  percentage: (isPositive) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: '8px',
    color: isPositive ? '#28a745' : '#dc3545'
  }),
  comparisonText: {
    color: '#666'
  },
  chartSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 16px 0'
  },
  chartContainer: {
    height: '200px',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '24px',
    borderBottom: '1px solid #eee'
  },
  barGroup: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    height: '100%'
  },
  bar: (height, isMax) => ({
    width: '60%',
    backgroundColor: isMax ? 'var(--primary-dark-color, #0056b3)' : 'var(--primary-color)',
    borderRadius: '4px 4px 0 0',
    height: `${height}%`,
    minHeight: '1px',
    transition: 'height 0.3s ease'
  }),
  barLabel: {
    position: 'absolute',
    bottom: '-24px',
    fontSize: '11px',
    color: '#666'
  },
  hourlyBreakdown: {
    marginTop: '24px'
  },
  hourTitle: {
    fontSize: '14px',
    margin: '12px 0 8px',
    color: '#555'
  },
  hoursGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px'
  },
  hourCard: (isActive) => ({
    backgroundColor: isActive ? '#e3f2fd' : '#f8f9fa',
    borderRadius: '6px',
    padding: '12px',
    borderLeft: isActive ? '3px solid var(--primary-color)' : 'none'
  }),
  hourLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px'
  },
  hourValue: (isActive) => ({
    fontSize: '16px',
    fontWeight: '600',
    color: isActive ? 'var(--primary-color)' : '#333'
  }),
  hourOrders: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px'
  }
};

function TodaySalesWidget() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    orderCount: 0,
    averageOrder: 0,
    customerCount: 0,
    comparisonPercentage: 0,
    isPositive: true
  });
  const [hourlySales, setHourlySales] = useState([]);
  const [hourlyOrders, setHourlyOrders] = useState([]);
  
  useEffect(() => {
    fetchSalesData();
  }, [selectedDate]);
  
  const fetchSalesData = () => {
    // Get all orders
    const allOrders = getOrders();
    
    // Filter orders for the selected date
    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDateObj);
    endOfDay.setHours(23, 59, 59, 999);
    
    const ordersForSelectedDate = allOrders.filter(order => {
      const orderDate = new Date(order.timestamp || order.date);
      return orderDate >= startOfDay && orderDate <= endOfDay;
    });
    
    // Calculate total sales for the selected date
    const totalSales = ordersForSelectedDate.reduce((sum, order) => {
      // Skip fully refunded orders
      if (order.status === 'refunded') return sum;
      
      // For partial refunds, subtract the refunded amount
      if (order.status === 'partial-refunded' && order.refunds) {
        const refundedAmount = order.refunds.reduce((total, refund) => total + refund.amount, 0);
        return sum + (order.total - refundedAmount);
      }
      
      return sum + order.total;
    }, 0);
    
    // Get unique customers
    const uniqueCustomers = new Set();
    ordersForSelectedDate.forEach(order => {
      if (order.customerId) {
        uniqueCustomers.add(order.customerId);
      } else if (order.customer && order.customer !== 'Walk in customer') {
        uniqueCustomers.add(order.customer);
      }
    });
    
    // Calculate average order value
    const averageOrder = ordersForSelectedDate.length > 0 
      ? totalSales / ordersForSelectedDate.length 
      : 0;
    
    // Get previous day for comparison
    const previousDay = new Date(selectedDateObj);
    previousDay.setDate(previousDay.getDate() - 1);
    
    const startOfPreviousDay = new Date(previousDay);
    startOfPreviousDay.setHours(0, 0, 0, 0);
    
    const endOfPreviousDay = new Date(previousDay);
    endOfPreviousDay.setHours(23, 59, 59, 999);
    
    const ordersForPreviousDay = allOrders.filter(order => {
      const orderDate = new Date(order.timestamp || order.date);
      return orderDate >= startOfPreviousDay && orderDate <= endOfPreviousDay;
    });
    
    const previousDaySales = ordersForPreviousDay.reduce((sum, order) => {
      if (order.status === 'refunded') return sum;
      
      if (order.status === 'partial-refunded' && order.refunds) {
        const refundedAmount = order.refunds.reduce((total, refund) => total + refund.amount, 0);
        return sum + (order.total - refundedAmount);
      }
      
      return sum + order.total;
    }, 0);
    
    // Calculate comparison percentage
    let comparisonPercentage = 0;
    let isPositive = true;
    
    if (previousDaySales > 0) {
      const difference = totalSales - previousDaySales;
      comparisonPercentage = (difference / previousDaySales) * 100;
      isPositive = difference >= 0;
    } else if (totalSales > 0) {
      comparisonPercentage = 100;
      isPositive = true;
    }
    
    // Get hourly sales data
    const hourlyData = getSalesByHour(selectedDate);
    setHourlySales(hourlyData);
    
    // Get hourly orders data
    const hourlyOrdersData = getOrdersByHour(selectedDate);
    setHourlyOrders(hourlyOrdersData);
    
    // Update sales data state
    setSalesData({
      totalSales,
      orderCount: ordersForSelectedDate.length,
      averageOrder,
      customerCount: uniqueCustomers.size,
      comparisonPercentage: Math.abs(comparisonPercentage),
      isPositive
    });
  };
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  // Format time for display (e.g., "9 AM", "2 PM")
  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  
  // Find the hour with the highest sales
  const maxSalesHour = hourlySales.indexOf(Math.max(...hourlySales));
  
  // Calculate the maximum value for scaling the chart
  const maxSalesValue = Math.max(...hourlySales, 1); // Ensure we don't divide by zero
  
  // Group hours for display (e.g., morning, afternoon, evening)
  const morningHours = [6, 7, 8, 9, 10, 11];
  const afternoonHours = [12, 13, 14, 15, 16, 17];
  const eveningHours = [18, 19, 20, 21, 22, 23];
  
  // Get current hour
  const currentHour = new Date().getHours();
  
  return (
    <div style={styles.widgetContainer}>
      <div style={styles.widgetHeader}>
        <h2 style={styles.headerTitle}>Sales Overview</h2>
        <div style={styles.dateSelector}>
          <label style={styles.dateLabel}>Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            style={styles.dateInput}
          />
        </div>
      </div>
      
      <div style={styles.summaryCards}>
        <div style={styles.summaryCard('#e3f2fd', '#1976d2', '#1976d2')}>
          <div style={styles.cardTitle('#1976d2')}>
            <FiDollarSign style={styles.cardIcon} />
            Total Sales
          </div>
          <div style={styles.cardValue('#1976d2')}>${salesData.totalSales.toFixed(2)}</div>
          <div style={styles.cardComparison}>
            <div style={styles.percentage(salesData.isPositive)}>
              {salesData.isPositive ? <FiArrowUp style={styles.cardIcon} /> : <FiArrowDown style={styles.cardIcon} />}
              {salesData.comparisonPercentage.toFixed(1)}%
            </div>
            <div style={styles.comparisonText}>vs previous day</div>
          </div>
        </div>
        
        <div style={styles.summaryCard('#e8f5e9', '#2e7d32', '#2e7d32')}>
          <div style={styles.cardTitle('#2e7d32')}>
            <FiShoppingBag style={styles.cardIcon} />
            Orders
          </div>
          <div style={styles.cardValue('#2e7d32')}>{salesData.orderCount}</div>
          <div style={styles.cardComparison}>
            <div style={{...styles.percentage(true), color: '#2e7d32'}}>
              <FiArrowUp style={styles.cardIcon} />
              {salesData.orderCount > 0 ? ((salesData.orderCount / Math.max(1, salesData.customerCount)) * 100).toFixed(0) : 0}%
            </div>
            <div style={styles.comparisonText}>conversion rate</div>
          </div>
        </div>
        
        <div style={styles.summaryCard('#fff8e1', '#f57c00', '#f57c00')}>
          <div style={styles.cardTitle('#f57c00')}>
            <FiDollarSign style={styles.cardIcon} />
            Average Order
          </div>
          <div style={styles.cardValue('#f57c00')}>${salesData.averageOrder.toFixed(2)}</div>
          <div style={styles.cardComparison}>
            <div style={{...styles.percentage(true), color: '#f57c00'}}>
              {salesData.orderCount > 0 ? '100%' : '0%'}
            </div>
            <div style={styles.comparisonText}>of total sales</div>
          </div>
        </div>
        
        <div style={styles.summaryCard('#f3e5f5', '#7b1fa2', '#7b1fa2')}>
          <div style={styles.cardTitle('#7b1fa2')}>
            <FiUsers style={styles.cardIcon} />
            Customers
          </div>
          <div style={styles.cardValue('#7b1fa2')}>{salesData.customerCount}</div>
          <div style={styles.cardComparison}>
            <div style={{...styles.percentage(salesData.customerCount > 0 && salesData.orderCount > salesData.customerCount), color: '#7b1fa2'}}>
              {salesData.customerCount > 0 && salesData.orderCount > salesData.customerCount 
                ? <FiArrowUp style={styles.cardIcon} /> 
                : <FiArrowDown style={styles.cardIcon} />}
              {salesData.customerCount > 0 
                ? ((salesData.orderCount / salesData.customerCount) * 100).toFixed(0) 
                : 0}%
            </div>
            <div style={styles.comparisonText}>orders per customer</div>
          </div>
        </div>
      </div>
      
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Hourly Sales</h3>
        <div style={styles.chartContainer}>
          {hourlySales.map((sales, hour) => (
            <div key={hour} style={styles.barGroup}>
              <div style={styles.bar((sales / maxSalesValue) * 100, hour === maxSalesHour)}></div>
              <div style={styles.barLabel}>{formatHour(hour)}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.hourlyBreakdown}>
        <h3 style={styles.sectionTitle}>
          <FiClock style={styles.cardIcon} />
          Hourly Breakdown
        </h3>
        
        <h4 style={styles.hourTitle}>Morning (6 AM - 12 PM)</h4>
        <div style={styles.hoursGrid}>
          {morningHours.map(hour => (
            <div 
              key={hour} 
              style={styles.hourCard(hour === currentHour)}
            >
              <div style={styles.hourLabel}>{formatHour(hour)}</div>
              <div style={styles.hourValue(hour === currentHour)}>${hourlySales[hour]?.toFixed(2) || '0.00'}</div>
              <div style={styles.hourOrders}>{hourlyOrders[hour]?.length || 0} orders</div>
            </div>
          ))}
        </div>
        
        <h4 style={styles.hourTitle}>Afternoon (12 PM - 6 PM)</h4>
        <div style={styles.hoursGrid}>
          {afternoonHours.map(hour => (
            <div 
              key={hour} 
              style={styles.hourCard(hour === currentHour)}
            >
              <div style={styles.hourLabel}>{formatHour(hour)}</div>
              <div style={styles.hourValue(hour === currentHour)}>${hourlySales[hour]?.toFixed(2) || '0.00'}</div>
              <div style={styles.hourOrders}>{hourlyOrders[hour]?.length || 0} orders</div>
            </div>
          ))}
        </div>
        
        <h4 style={styles.hourTitle}>Evening (6 PM - 12 AM)</h4>
        <div style={styles.hoursGrid}>
          {eveningHours.map(hour => (
            <div 
              key={hour} 
              style={styles.hourCard(hour === currentHour)}
            >
              <div style={styles.hourLabel}>{formatHour(hour)}</div>
              <div style={styles.hourValue(hour === currentHour)}>${hourlySales[hour]?.toFixed(2) || '0.00'}</div>
              <div style={styles.hourOrders}>{hourlyOrders[hour]?.length || 0} orders</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodaySalesWidget;
