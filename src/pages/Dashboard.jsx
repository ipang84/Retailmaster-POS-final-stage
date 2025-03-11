import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiPackage, 
  FiAlertTriangle, 
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiMonitor,
  FiShoppingCart
} from 'react-icons/fi';
import { getLowStockProducts, getProducts } from '../services/productService';
import { getOrders } from '../services/orderService';
import RegisterSessionModal from '../components/RegisterSessionModal';
import EndRegisterSessionModal from '../components/EndRegisterSessionModal';
import { hasActiveSession } from '../services/registerService';

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
    flex-shrink: 0;
  }
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
  }
  
  &.secondary {
    background-color: white;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
  
  &.icon-only {
    padding: 10px;
    
    svg {
      margin-right: 0;
    }
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const NewOrderButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  
  svg {
    margin-right: 8px;
    font-size: 18px;
    flex-shrink: 0;
  }
  
  &:hover {
    background-color: #0055cc;
  }
  
  @media (max-width: 576px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const SummaryCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .content {
    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: ${props => props.iconBg || '#e6f7ff'};
    color: ${props => props.iconColor || '#0066ff'};
    font-size: 24px;
  }
  
  &.alert {
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      font-size: 20px;
      margin-right: 12px;
      color: #555;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
`;

const InventoryValueList = styled.div`
  .item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .label {
      color: #666;
    }
    
    .value {
      font-weight: 600;
      color: #333;
    }
    
    .value.profit {
      color: #00cc66;
    }
    
    .arrow {
      margin-left: 8px;
      
      &.up {
        color: #00cc66;
      }
      
      &.down {
        color: #ff4d4f;
      }
    }
  }
`;

const TopSellingItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  .product-info {
    .name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .qty {
      font-size: 14px;
      color: #666;
    }
  }
  
  .price {
    font-weight: 600;
    color: #333;
  }
  
  .details-link {
    font-size: 14px;
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
`;

const EmptyState = styled.div`
  padding: 20px 0;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const LowStockList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon {
      font-size: 20px;
      margin-right: 12px;
      color: #ff6600;
    }
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .low-stock-items {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .product-info {
        display: flex;
        align-items: center;
        
        .product-image {
          width: 32px;
          height: 32px;
          background-color: #f5f5f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          overflow: hidden;
          
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        
        .product-name {
          font-weight: 500;
        }
      }
      
      .stock-info {
        display: flex;
        align-items: center;
        
        .current {
          color: #ff6600;
          font-weight: 600;
          margin-right: 8px;
        }
        
        .min {
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
  
  .view-all {
    display: block;
    text-align: center;
    margin-top: 16px;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Dashboard() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEndRegisterModalOpen, setIsEndRegisterModalOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [inventoryValues, setInventoryValues] = useState({
    retailValue: 0,
    costValue: 0,
    potentialProfit: 0
  });
  const [previousInventoryValues, setPreviousInventoryValues] = useState({
    retailValue: 0,
    costValue: 0
  });
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeSession, setActiveSession] = useState(false);

  useEffect(() => {
    // Check if there's an active session
    setActiveSession(hasActiveSession());
    
    // Get low stock products
    const lowStock = getLowStockProducts() || [];
    setLowStockItems(lowStock);
    
    // Get total product count
    const products = getProducts() || [];
    setTotalProducts(products.length);
    
    // Calculate today's sales
    calculateTodaySales();
    
    // Calculate inventory values
    calculateInventoryValues(products);
    
    // Get top selling items
    getTopSellingItems();
    
    // Get pending orders count
    calculatePendingOrders();
  }, []);

  const calculateInventoryValues = (products) => {
    if (!products || !Array.isArray(products)) {
      products = [];
    }
    
    // Calculate cost value (what you paid for inventory)
    const costValue = products.reduce((total, product) => {
      if (product.inventory && product.cost) {
        return total + (product.inventory * product.cost);
      }
      return total;
    }, 0);
    
    // Calculate retail value (what you could sell inventory for)
    const retailValue = products.reduce((total, product) => {
      if (product.inventory && product.price) {
        return total + (product.inventory * product.price);
      }
      return total;
    }, 0);
    
    // Calculate potential profit
    const potentialProfit = retailValue - costValue;
    
    // Set the values
    setInventoryValues({
      retailValue,
      costValue,
      potentialProfit
    });
    
    // For demonstration purposes, set previous values to simulate changes
    // In a real app, you would store historical data and compare
    setPreviousInventoryValues({
      retailValue: retailValue * 0.95, // Simulate 5% increase
      costValue: costValue * 1.05     // Simulate 5% decrease
    });
  };

  const calculateTodaySales = () => {
    try {
      const orders = getOrders() || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filter orders from today and sum their totals
      const todayOrders = orders.filter(order => {
        if (!order || !order.timestamp) return false;
        
        const orderDate = new Date(order.timestamp);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      
      const total = todayOrders.reduce((sum, order) => {
        // Only count completed or partial-refunded orders
        if (order.status === 'completed' || order.status === 'partial-refunded') {
          // For partial refunds, subtract the refunded amount
          if (order.refunds && order.refunds.length > 0) {
            const refundTotal = order.refunds.reduce((refundSum, refund) => refundSum + refund.amount, 0);
            return sum + (order.total - refundTotal);
          }
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);
      
      setTodaySales(total);
    } catch (error) {
      console.error("Error calculating today's sales:", error);
      setTodaySales(0);
    }
  };

  const calculatePendingOrders = () => {
    try {
      const orders = getOrders() || [];
      const pendingCount = orders.filter(order => 
        order && (order.status === 'pending' || order.status === 'processing')
      ).length;
      
      setPendingOrders(pendingCount);
    } catch (error) {
      console.error("Error calculating pending orders:", error);
      setPendingOrders(0);
    }
  };

  const getTopSellingItems = () => {
    try {
      const orders = getOrders() || [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Filter orders from the last 30 days
      const recentOrders = orders.filter(order => {
        if (!order || !order.timestamp) return false;
        
        const orderDate = new Date(order.timestamp);
        return orderDate >= thirtyDaysAgo && 
               (order.status === 'completed' || order.status === 'partial-refunded');
      });
      
      // Create a map to track item sales
      const itemSales = {};
      
      // Process each order
      recentOrders.forEach(order => {
        if (!order.items || !Array.isArray(order.items)) return;
        
        // Process each item in the order
        order.items.forEach(item => {
          // Skip items without an ID (should not happen)
          if (!item || !item.id) return;
          
          // Initialize or update the item in our tracking map
          if (!itemSales[item.id]) {
            itemSales[item.id] = {
              id: item.id,
              name: item.name || 'Unknown Product',
              quantity: 0,
              revenue: 0,
              price: item.price || 0
            };
          }
          
          // Add the quantity sold in this order
          itemSales[item.id].quantity += (item.quantity || 0);
          
          // Add the revenue from this item
          itemSales[item.id].revenue += ((item.price || 0) * (item.quantity || 0));
        });
      });
      
      // Convert the map to an array and sort by quantity sold (descending)
      const topItems = Object.values(itemSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 4); // Get top 4 items (changed from 5 to 4)
      
      setTopSellingItems(topItems);
    } catch (error) {
      console.error("Error getting top selling items:", error);
      setTopSellingItems([]);
    }
  };

  const handleRegisterButtonClick = () => {
    if (activeSession) {
      setIsEndRegisterModalOpen(true);
    } else {
      setIsRegisterModalOpen(true);
    }
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const closeEndRegisterModal = () => {
    setIsEndRegisterModalOpen(false);
  };

  const handleSessionStart = () => {
    setActiveSession(true);
    // Refresh data after session starts
    calculateTodaySales();
  };

  const handleSessionEnd = () => {
    setActiveSession(false);
    // Refresh data after session ends
    calculateTodaySales();
  };

  // Calculate if values have increased or decreased
  const retailValueIncreased = inventoryValues.retailValue > previousInventoryValues.retailValue;
  const costValueIncreased = inventoryValues.costValue > previousInventoryValues.costValue;

  return (
    <PageContainer>
      <PageHeader>
        <Title>Dashboard</Title>
        <ActionButtons>
          <Button className="primary" onClick={handleRegisterButtonClick}>
            <FiMonitor />
            {activeSession ? "End Register Session" : "Start Register Session"}
          </Button>
          <Button className="secondary" as={Link} to="/inventory">
            <FiPackage />
            Manage Inventory
          </Button>
          <NewOrderButton to="/orders/new">
            <FiShoppingCart />
            New Order
          </NewOrderButton>
        </ActionButtons>
      </PageHeader>
      
      <SummaryCardsGrid>
        <SummaryCard iconBg="#e6f7ff" iconColor="#0066ff">
          <div className="content">
            <div className="label">Today's Sales</div>
            <div className="value">${todaySales.toFixed(2)}</div>
          </div>
          <div className="icon">
            <FiDollarSign />
          </div>
        </SummaryCard>
        
        <SummaryCard iconBg="#e6ffe6" iconColor="#00cc66">
          <div className="content">
            <div className="label">Total Products</div>
            <div className="value">{totalProducts}</div>
          </div>
          <div className="icon">
            <FiPackage />
          </div>
        </SummaryCard>
        
        <SummaryCard 
          iconBg="#fff0e6" 
          iconColor="#ff6600" 
          className={lowStockItems.length > 0 ? "alert" : ""}
          as={lowStockItems.length > 0 ? Link : "div"}
          to={lowStockItems.length > 0 ? "/inventory" : undefined}
        >
          <div className="content">
            <div className="label">Low Stock Items</div>
            <div className="value">{lowStockItems.length}</div>
          </div>
          <div className="icon">
            <FiAlertTriangle />
          </div>
        </SummaryCard>
        
        <SummaryCard iconBg="#e6e6ff" iconColor="#6666ff">
          <div className="content">
            <div className="label">Pending Orders</div>
            <div className="value">{pendingOrders}</div>
          </div>
          <div className="icon">
            <FiClock />
          </div>
        </SummaryCard>
      </SummaryCardsGrid>
      
      {lowStockItems.length > 0 && (
        <LowStockList>
          <div className="header">
            <div className="icon">
              <FiAlertTriangle />
            </div>
            <div className="title">Low Stock Items</div>
          </div>
          <div className="low-stock-items">
            {lowStockItems.slice(0, 5).map(item => (
              <div key={item.id} className="item">
                <div className="product-info">
                  <div className="product-image">
                    {item.image && <img src={item.image} alt={item.name} />}
                  </div>
                  <div className="product-name">{item.name}</div>
                </div>
                <div className="stock-info">
                  <div className="current">{item.inventory}</div>
                  <div className="min">(min: {item.minStock})</div>
                </div>
              </div>
            ))}
          </div>
          
          {lowStockItems.length > 5 && (
            <Link to="/inventory" className="view-all">
              View all {lowStockItems.length} low stock items
            </Link>
          )}
        </LowStockList>
      )}
      
      <StatsGrid>
        <StatsCard>
          <div className="header">
            <div className="icon">
              <FiTrendingUp />
            </div>
            <div className="title">Inventory Value</div>
          </div>
          
          <InventoryValueList>
            <div className="item">
              <div className="label">Retail Value</div>
              <div className="value">
                ${inventoryValues.retailValue.toFixed(2)} 
                {retailValueIncreased ? 
                  <FiArrowUp className="arrow up" /> : 
                  <FiArrowDown className="arrow down" />
                }
              </div>
            </div>
            <div className="item">
              <div className="label">Cost Value</div>
              <div className="value">
                ${inventoryValues.costValue.toFixed(2)} 
                {costValueIncreased ? 
                  <FiArrowUp className="arrow up" /> : 
                  <FiArrowDown className="arrow down" />
                }
              </div>
            </div>
            <div className="item">
              <div className="label">Potential Profit</div>
              <div className="value profit">${inventoryValues.potentialProfit.toFixed(2)}</div>
            </div>
          </InventoryValueList>
        </StatsCard>
        
        <StatsCard>
          <div className="header">
            <div className="icon">
              <FiShoppingBag />
            </div>
            <div className="title">Top Selling Items (30 Days)</div>
          </div>
          
          {topSellingItems.length > 0 ? (
            topSellingItems.map(item => (
              <TopSellingItem key={item.id}>
                <div className="product-info">
                  <div className="name">{item.name}</div>
                  <div className="qty">Qty: {item.quantity}</div>
                </div>
                <div>
                  <div className="price">${item.price.toFixed(2)}</div>
                  <Link to={`/products/edit/${item.id}`} className="details-link">View details</Link>
                </div>
              </TopSellingItem>
            ))
          ) : (
            <EmptyState>No sales data available for the last 30 days</EmptyState>
          )}
        </StatsCard>
      </StatsGrid>
      
      {/* Register Session Modals */}
      <RegisterSessionModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeRegisterModal}
        onSessionStart={handleSessionStart}
      />
      
      <EndRegisterSessionModal 
        isOpen={isEndRegisterModalOpen} 
        onClose={closeEndRegisterModal}
        onSessionEnd={handleSessionEnd}
      />
    </PageContainer>
  );
}

export default Dashboard;
