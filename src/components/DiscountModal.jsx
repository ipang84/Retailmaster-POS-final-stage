import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiPercent, FiDollarSign } from 'react-icons/fi';

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

const DiscountTypeSelector = styled.div`
  display: flex;
  margin-bottom: 16px;
  
  button {
    flex: 1;
    padding: 10px;
    background-color: ${props => props.active === props.type ? '#4a89dc' : 'white'};
    color: ${props => props.active === props.type ? 'white' : '#333'};
    border: 1px solid ${props => props.active === props.type ? '#4a89dc' : '#ddd'};
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    
    svg {
      margin-right: 6px;
    }
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
  
  input {
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
  
  .discount-preview {
    margin-top: 12px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    
    .preview-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      
      &:last-child {
        margin-bottom: 0;
        padding-top: 6px;
        border-top: 1px solid #eee;
        font-weight: 600;
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
  
  .apply-button {
    background-color: #4a89dc;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3b7dd8;
    }
  }
`;

function DiscountModal({ isOpen, onClose, onApplyDiscount, subtotal }) {
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setDiscountType('percentage');
      setDiscountValue('');
      setDiscountAmount(0);
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Calculate discount amount based on type and value
    if (discountType === 'percentage') {
      const percentage = parseFloat(discountValue) || 0;
      const amount = (subtotal * percentage) / 100;
      setDiscountAmount(amount);
    } else {
      setDiscountAmount(parseFloat(discountValue) || 0);
    }
  }, [discountType, discountValue, subtotal]);
  
  const handleApplyDiscount = () => {
    const discount = {
      type: discountType,
      value: parseFloat(discountValue) || 0,
      amount: discountAmount
    };
    
    onApplyDiscount(discount);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Apply Discount</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <DiscountTypeSelector active={discountType}>
            <button 
              type="button"
              className={discountType === 'percentage' ? 'active' : ''}
              onClick={() => setDiscountType('percentage')}
            >
              <FiPercent />
              Percentage
            </button>
            <button 
              type="button"
              className={discountType === 'fixed' ? 'active' : ''}
              onClick={() => setDiscountType('fixed')}
            >
              <FiDollarSign />
              Fixed Amount
            </button>
          </DiscountTypeSelector>
          
          <FormGroup>
            <label>
              {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </label>
            <input 
              type="number" 
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              min="0"
              max={discountType === 'percentage' ? '100' : subtotal.toString()}
              step="0.01"
            />
            <div className="helper-text">
              {discountType === 'percentage' 
                ? 'Enter a percentage between 0 and 100' 
                : `Enter an amount between 0 and ${subtotal.toFixed(2)}`}
            </div>
            
            <div className="discount-preview">
              <div className="preview-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="preview-row">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="preview-row">
                <span>After Discount:</span>
                <span>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>
            </div>
          </FormGroup>
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="apply-button" onClick={handleApplyDiscount}>
            Apply Discount
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DiscountModal;
