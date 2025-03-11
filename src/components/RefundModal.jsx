import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaWallet } from 'react-icons/fa';
import { processRefund, getRemainingBalance } from '../services/orderService';

const RefundModal = ({ isOpen, onClose, order, onRefundComplete }) => {
  const [refundItems, setRefundItems] = useState([]);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundMethod, setRefundMethod] = useState('cash');
  const [refundNote, setRefundNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [refundTax, setRefundTax] = useState(0);
  const [refundSubtotal, setRefundSubtotal] = useState(0);
  const [refundTotal, setRefundTotal] = useState(0);

  useEffect(() => {
    if (order && order.items) {
      // Initialize refund items from order items
      const initialRefundItems = order.items.map(item => ({
        ...item,
        refundQuantity: 0,
        condition: 'new', // Default condition
        maxQuantity: item.quantity
      }));
      setRefundItems(initialRefundItems);
      
      // Calculate remaining balance - for completed orders, this should be the total order amount
      const remaining = order.status === 'completed' ? order.total : getRemainingBalance(order);
      setRemainingBalance(remaining);
      
      // Calculate tax rate from the order
      if (order.subtotal > 0 && order.tax > 0) {
        const calculatedTaxRate = order.tax / order.subtotal;
        setTaxRate(calculatedTaxRate);
      } else {
        setTaxRate(0);
      }
    }
  }, [order]);

  // Calculate the total refund amount based on selected items
  useEffect(() => {
    if (!refundItems || refundItems.length === 0) return;
    
    const subtotal = refundItems.reduce((sum, item) => {
      return sum + (item.refundQuantity * item.price);
    }, 0);
    
    // Calculate tax amount based on the original order's tax rate
    const taxAmount = subtotal * taxRate;
    
    // Set the refund amounts
    setRefundSubtotal(subtotal);
    setRefundTax(taxAmount);
    setRefundTotal(subtotal + taxAmount);
    setRefundAmount(subtotal + taxAmount);
  }, [refundItems, taxRate]);

  const handleQuantityChange = (index, value) => {
    try {
      // Safely parse the input value
      const newValue = parseInt(value, 10);
      const updatedItems = [...refundItems];
      
      // Only update if we have a valid number
      if (!isNaN(newValue)) {
        // Ensure quantity doesn't exceed the maximum and isn't negative
        updatedItems[index].refundQuantity = Math.min(
          Math.max(0, newValue), // Ensure it's not negative
          updatedItems[index].maxQuantity // Ensure it doesn't exceed max
        );
      } else {
        // If not a valid number, set to 0
        updatedItems[index].refundQuantity = 0;
      }
      
      setRefundItems(updatedItems);
    } catch (err) {
      console.error("Error updating quantity:", err);
      // Don't update state if there's an error
    }
  };

  const handleConditionChange = (index, condition) => {
    try {
      const updatedItems = [...refundItems];
      updatedItems[index].condition = condition;
      setRefundItems(updatedItems);
    } catch (err) {
      console.error("Error updating condition:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccess('');

    // Validate that at least one item is being refunded
    const hasRefundItems = refundItems.some(item => item.refundQuantity > 0);
    if (!hasRefundItems) {
      setError('Please select at least one item to refund');
      setIsProcessing(false);
      return;
    }
    
    // For completed orders, we should allow refunding up to the total order amount
    // Skip this validation for completed orders
    if (order.status !== 'completed' && refundTotal > remainingBalance) {
      setError(`Refund amount (${refundTotal.toFixed(2)}) cannot exceed remaining balance (${remainingBalance.toFixed(2)})`);
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare refund data
      const refundData = {
        orderId: order.id,
        timestamp: Date.now(),
        amount: refundTotal,
        subtotal: refundSubtotal,
        tax: refundTax,
        items: refundItems
          .filter(item => item.refundQuantity > 0)
          .map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.refundQuantity,
            condition: item.condition,
            // Calculate the tax for this specific item
            tax: (item.price * item.refundQuantity * taxRate).toFixed(2)
          })),
        method: refundMethod,
        note: refundNote
      };

      // Process the refund
      const result = await processRefund(refundData);
      
      setSuccess(`Refund processed successfully. ${
        result.inventoryUpdated ? 'Inventory has been updated for new condition items.' : ''
      } ${
        result.inventoryErrors ? 'Some inventory updates failed.' : ''
      }`);
      
      // Close the modal after a short delay
      setTimeout(() => {
        if (onRefundComplete) {
          onRefundComplete(refundData);
        }
        onClose(true); // Pass true to indicate a successful refund
      }, 2000);
      
    } catch (err) {
      setError(`Failed to process refund: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.stopPropagation()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Process Refund</h2>
          <CloseButton onClick={() => onClose(false)}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <OrderInfo>
            <p><strong>Order #:</strong> {order?.id}</p>
            <p><strong>Date:</strong> {new Date(order?.timestamp || order?.date).toLocaleString()}</p>
            <p><strong>Customer:</strong> {order?.customer?.name || order?.customer || 'Guest'}</p>
            <p><strong>Original Total:</strong> ${order?.total?.toFixed(2) || '0.00'}</p>
            <p><strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}</p>
            {taxRate > 0 && (
              <p><strong>Tax Rate:</strong> {(taxRate * 100).toFixed(2)}%</p>
            )}
          </OrderInfo>

          <form onSubmit={handleSubmit}>
            <ItemsSection>
              <h3>Select Items to Refund</h3>
              <ItemsTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Refund Qty</th>
                    <th>Condition</th>
                    <th>Subtotal</th>
                    {taxRate > 0 && <th>Tax</th>}
                  </tr>
                </thead>
                <tbody>
                  {refundItems.map((item, index) => {
                    const itemSubtotal = (item.refundQuantity || 0) * item.price;
                    const itemTax = itemSubtotal * taxRate;
                    
                    return (
                      <tr key={`${item.id || index}-${index}`}>
                        <td>{item.name}</td>
                        <td>${item.price?.toFixed(2) || '0.00'}</td>
                        <td>{item.maxQuantity}</td>
                        <td>
                          <QuantityInput
                            type="number"
                            min="0"
                            max={item.maxQuantity}
                            value={item.refundQuantity || 0}
                            onChange={(e) => {
                              // Prevent default to avoid form submission
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuantityChange(index, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td>
                          <select
                            value={item.condition}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConditionChange(index, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={item.refundQuantity <= 0}
                          >
                            <option value="new">New (Return to Inventory)</option>
                            <option value="damaged">Damaged (Do Not Return)</option>
                            <option value="opened">Opened (Do Not Return)</option>
                          </select>
                        </td>
                        <td>${itemSubtotal.toFixed(2)}</td>
                        {taxRate > 0 && <td>${itemTax.toFixed(2)}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </ItemsTable>
            </ItemsSection>

            <RefundDetails>
              <h3>Refund Details</h3>
              
              <RefundMethodSection>
                <h4>Refund Method</h4>
                <RefundMethods>
                  <RefundMethodOption 
                    selected={refundMethod === 'cash'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRefundMethod('cash');
                    }}
                  >
                    <FaMoneyBillWave />
                    <span>Cash</span>
                  </RefundMethodOption>
                  
                  <RefundMethodOption 
                    selected={refundMethod === 'card'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRefundMethod('card');
                    }}
                  >
                    <FaCreditCard />
                    <span>Card</span>
                  </RefundMethodOption>
                  
                  <RefundMethodOption 
                    selected={refundMethod === 'store_credit'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRefundMethod('store_credit');
                    }}
                  >
                    <FaWallet />
                    <span>Store Credit</span>
                  </RefundMethodOption>
                </RefundMethods>
              </RefundMethodSection>
              
              <div>
                <label htmlFor="refundNote">Note:</label>
                <NoteTextarea
                  id="refundNote"
                  value={refundNote}
                  onChange={(e) => {
                    e.stopPropagation();
                    setRefundNote(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter reason for refund or additional notes"
                />
              </div>
              
              <TotalSection>
                <div className="refund-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${refundSubtotal.toFixed(2)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="summary-row">
                      <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
                      <span>${refundTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total Refund:</span>
                    <span>${refundTotal.toFixed(2)}</span>
                  </div>
                </div>
              </TotalSection>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <ButtonGroup>
                <CancelButton 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose(false);
                  }}
                >
                  Cancel
                </CancelButton>
                <SubmitButton 
                  type="submit" 
                  disabled={isProcessing || refundTotal <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Process Refund'}
                </SubmitButton>
              </ButtonGroup>
            </RefundDetails>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
  
  p {
    margin: 5px 0;
  }
`;

const ItemsSection = styled.div`
  margin-bottom: 25px;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RefundDetails = styled.div`
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
`;

const RefundMethodSection = styled.div`
  margin-bottom: 20px;
  
  h4 {
    margin-bottom: 10px;
    color: #555;
  }
`;

const RefundMethods = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const RefundMethodOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  background-color: ${props => props.selected ? '#f0f9f0' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4CAF50;
  }
  
  svg {
    font-size: 24px;
    margin-bottom: 8px;
    color: ${props => props.selected ?'#4CAF50' : '#666'};
  }
  
  span {
    font-weight: ${props => props.selected ? '600' : 'normal'};
  }
`;

const NoteTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 80px;
  margin-bottom: 20px;
`;

const TotalSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  
  .refund-summary {
    width: 100%;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &.total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      font-weight: 600;
      font-size: 18px;
    }
  }
`;

const TotalAmount = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #4CAF50;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #3d8b40;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

export default RefundModal;
