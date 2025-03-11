import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

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
  max-height: 70vh;
  overflow-y: auto;
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
  
  input, textarea, select {
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
  
  textarea {
    min-height: 80px;
    resize: vertical;
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
`;

const FormSection = styled.div`
  margin-bottom: 20px;
  
  .section-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 15px;
    color: #333;
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
  
  .save-button {
    background-color: #4a89dc;
    color: white;
    border: none;
    
    &:hover {
      background-color: #3b7dd8;
    }
    
    &:disabled {
      background-color: #a5c0e5;
      cursor: not-allowed;
    }
  }
`;

function CustomerModal({ isOpen, onClose, onSave, customer }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    notes: ''
  });
  
  useEffect(() => {
    if (isOpen) {
      // If editing an existing customer, populate the form
      if (customer) {
        setFormData({
          ...customer,
          address: customer.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
          }
        });
      } else {
        // Reset form for new customer
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US'
          },
          notes: ''
        });
      }
    }
  }, [isOpen, customer]);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Handle nested address fields
    if (id.startsWith('address.')) {
      const addressField = id.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };
  
  const handleSave = () => {
    // Generate a unique ID if it's a new customer
    const customerData = customer ? { ...formData } : {
      ...formData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
      orders: 0,
      amountSpent: 0
    };
    
    onSave(customerData);
  };
  
  const isFormValid = () => {
    return formData.fullName.trim() !== '';
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>{customer ? 'Edit Customer' : 'Add Customer'}</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <FormSection>
            <div className="section-title">Customer Information</div>
            
            <FormGroup>
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="phone">Phone</label>
              <input 
                type="tel" 
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="companyName">Company (Optional)</label>
              <input 
                type="text" 
                id="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </FormGroup>
          </FormSection>
          
          <FormSection>
            <div className="section-title">Address</div>
            
            <FormGroup>
              <label htmlFor="address.street">Street Address</label>
              <input 
                type="text" 
                id="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
              />
            </FormGroup>
            
            <div className="input-row">
              <FormGroup className="input-group">
                <label htmlFor="address.city">City</label>
                <input 
                  type="text" 
                  id="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </FormGroup>
              
              <FormGroup className="input-group">
                <label htmlFor="address.state">State</label>
                <input 
                  type="text" 
                  id="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              </FormGroup>
            </div>
            
            <div className="input-row">
              <FormGroup className="input-group">
                <label htmlFor="address.zipCode">ZIP Code</label>
                <input 
                  type="text" 
                  id="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                />
              </FormGroup>
              
              <FormGroup className="input-group">
                <label htmlFor="address.country">Country</label>
                <select 
                  id="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormGroup>
            </div>
          </FormSection>
          
          <FormSection>
            <div className="section-title">Additional Information</div>
            
            <FormGroup>
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add notes about this customer"
              ></textarea>
            </FormGroup>
          </FormSection>
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={!isFormValid()}
          >
            Save Customer
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CustomerModal;
