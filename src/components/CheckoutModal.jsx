import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCreditCard, FiDollarSign, FiSmartphone, FiCheckCircle } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const OrderSummary = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    
    &.total-row {
      font-weight: 600;
      font-size: 16px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
  }
`;

const PaymentMethods = styled.div`
  margin-bottom: 20px;
  
  .methods-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 15px;
  }
  
  .methods-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    
    @media (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .method-card {
    border: 1px solid ${props => props.active === props.type ? '#4a89dc' : '#ddd'};
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: ${props => props.active === props.type ? 'rgba(74, 137, 220, 0.1)' : 'white'};
    
    &:hover {
      border-color: #4a89dc;
    }
    
    .method-icon {
      font-size: 24px;
      margin-bottom: 8px;
      color: ${props => props.active === props.type ? '#4a89dc' : '#666'};
    }
    
    .method-name {
      font-size: 13px;
      font-weight: 500;
      color: ${props => props.active === props.type ? '#4a89dc' : '#333'};
    }
  }
`;

const PaymentDetails = styled.div`
  margin-bottom: 20px;
  
  .details-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 15px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #4a89dc;
    }
  }
  
  .helper-text {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
  
  .input-row {
    display: flex;
    gap: 10px;
    
    .input-group {
      flex: 1;
    }
  }
  
  .change-calculation {
    margin-top: 12px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    .change-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 14px;
      
      &:last-child {
        margin-bottom: 0;
        padding-top: 6px;
        border-top: 1px solid #eee;
        font-weight: 600;
      }
    }
  }
`;

const CashAmountButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  
  button {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f9fa;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background-color: #e9ecef;
      border-color: #ced4da;
    }
    
    &.exact {
      grid-column: span 2;
      background-color: #e6f7ff;
      border-color: #91caff;
      color: #0066ff;
      
      &:hover {
        background-color: #d6eeff;
      }
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  gap: 12px;
  
  button {
    padding: 10px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
  }
  
  .cancel-button {
    background: none;
    border: 1px solid #ddd;
    color: #333;
    
    &:hover {
      border-color: #ccc;
      background-color: #f9f9f9;
    }
  }
  
  .complete-button {
    background-color: #4a89dc;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 6px;
    }
    
    &:hover {
      background-color: #3b7dd8;
    }
    
    &:disabled {
      background-color: #a5c0e5;
      cursor: not-allowed;
    }
  }
`;

function CheckoutModal({ isOpen, onClose, orderTotal, subtotal, discount, tax, onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [amountTendered, setAmountTendered] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [cardType, setCardType] = useState('visa');
  const [last4, setLast4] = useState('');
  const [mobileProvider, setMobileProvider] = useState('apple_pay');
  
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPaymentMethod('credit_card');
      setAmountTendered(orderTotal.toFixed(2));
      setChangeAmount(0);
      setCardType('visa');
      setLast4('');
      setMobileProvider('apple_pay');
    }
  }, [isOpen, orderTotal]);
  
  useEffect(() => {
    // Calculate change amount for cash payments
    if (paymentMethod === 'cash') {
      const tendered = parseFloat(amountTendered) || 0;
      const change = Math.max(0, tendered - orderTotal);
      setChangeAmount(change);
    }
  }, [amountTendered, orderTotal, paymentMethod]);
  
  const handleCompleteOrder = () => {
    let paymentDetails = {};
    
    switch (paymentMethod) {
      case 'credit_card':
        paymentDetails = {
          method: 'credit_card',
          cardType,
          last4
        };
        break;
      case 'cash':
        paymentDetails = {
          method: 'cash',
          amountTendered: parseFloat(amountTendered) || orderTotal,
          changeGiven: changeAmount
        };
        break;
      case 'mobile_payment':
        paymentDetails = {
          method: 'mobile_payment',
          provider: mobileProvider
        };
        break;
      default:
        paymentDetails = { method: paymentMethod };
    }
    
    onCompleteOrder(paymentDetails);
  };
  
  const isFormValid = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return last4.length === 4 && /^\d+$/.test(last4);
      case 'cash':
        return parseFloat(amountTendered) >= orderTotal;
      case 'mobile_payment':
        return true;
      default:
        return true;
    }
  };

  const handleCashAmountClick = (amount) => {
    if (amount === 'exact') {
      setAmountTendered(orderTotal.toFixed(2));
    } else {
      setAmountTendered(amount.toString());
    }
  };

  // Find the closest preset amount above the order total
  const getClosestAmount = () => {
    const presetAmounts = [50, 80, 100, 200];
    for (const amount of presetAmounts) {
      if (amount >= orderTotal) {
        return amount;
      }
    }
    return presetAmounts[presetAmounts.length - 1]; // Return the largest amount if total exceeds all presets
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Checkout</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <OrderSummary>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </OrderSummary>
          
          <PaymentMethods active={paymentMethod}>
            <div className="methods-title">Payment Method</div>
            <div className="methods-grid">
              <div 
                className="method-card" 
                type="credit_card"
                onClick={() => setPaymentMethod('credit_card')}
              >
                <FiCreditCard className="method-icon" />
                <div className="method-name">Credit Card</div>
              </div>
              <div 
                className="method-card" 
                type="cash"
                onClick={() => setPaymentMethod('cash')}
              >
                <FiDollarSign className="method-icon" />
                <div className="method-name">Cash</div>
              </div>
              <div 
                className="method-card" 
                type="mobile_payment"
                onClick={() => setPaymentMethod('mobile_payment')}
              >
                <FiSmartphone className="method-icon" />
                <div className="method-name">Mobile Payment</div>
              </div>
            </div>
          </PaymentMethods>
          
          <PaymentDetails>
            <div className="details-title">Payment Details</div>
            
            {paymentMethod === 'credit_card' && (
              <>
                <FormGroup>
                  <label>Card Type</label>
                  <select 
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="other">Other</option>
                  </select>
                </FormGroup>
                
                <FormGroup>
                  <label>Last 4 Digits</label>
                  <input 
                    type="text" 
                    value={last4}
                    onChange={(e) => setLast4(e.target.value.slice(0, 4))}
                    placeholder="Enter last 4 digits"
                    maxLength="4"
                    pattern="\d*"
                  />
                </FormGroup>
              </>
            )}
            
            {paymentMethod === 'cash' && (
              <FormGroup>
                <label>Amount Tendered</label>
                
                <CashAmountButtons>
                  <button 
                    className="exact" 
                    onClick={() => handleCashAmountClick('exact')}
                  >
                    Exact Amount (${orderTotal.toFixed(2)})
                  </button>
                  
                  <button onClick={() => handleCashAmountClick(50)}>$50</button>
                  <button onClick={() => handleCashAmountClick(80)}>$80</button>
                  <button onClick={() => handleCashAmountClick(100)}>$100</button>
                  <button onClick={() => handleCashAmountClick(200)}>$200</button>
                  <button onClick={() => handleCashAmountClick(getClosestAmount())}>
                    Closest (${getClosestAmount()})
                  </button>
                </CashAmountButtons>
                
                <input 
                  type="number" 
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(e.target.value)}
                  placeholder="Enter amount"
                  min={orderTotal}
                  step="0.01"
                />
                
                <div className="change-calculation">
                  <div className="change-row">
                    <span>Amount Tendered:</span>
                    <span>${parseFloat(amountTendered || 0).toFixed(2)}</span>
                  </div>
                  <div className="change-row">
                    <span>Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="change-row">
                    <span>Change Due:</span>
                    <span>${changeAmount.toFixed(2)}</span>
                  </div>
                </div>
              </FormGroup>
            )}
            
            {paymentMethod === 'mobile_payment' && (
              <FormGroup>
                <label>Payment Provider</label>
                <select 
                  value={mobileProvider}
                  onChange={(e) => setMobileProvider(e.target.value)}
                >
                  <option value="apple_pay">Apple Pay</option>
                  <option value="google_pay">Google Pay</option>
                  <option value="samsung_pay">Samsung Pay</option>
                  <option value="venmo">Venmo</option>
                  <option value="cash_app">Cash App</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>
            )}
          </PaymentDetails>
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="complete-button" 
            onClick={handleCompleteOrder}
            disabled={!isFormValid()}
          >
            <FiCheckCircle />
            Complete Order
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CheckoutModal;
