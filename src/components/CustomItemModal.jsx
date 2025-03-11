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
  
  input, textarea {
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
  
  .add-button {
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

function CustomItemModal({ isOpen, onClose, onAddItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setName('');
      setPrice('');
      setDescription('');
    }
  }, [isOpen]);
  
  const handleAddItem = () => {
    const customItem = {
      name,
      price: parseFloat(price) || 0,
      description,
      sku: 'CUSTOM-ITEM',
      isCustom: true
    };
    
    onAddItem(customItem);
  };
  
  const isFormValid = () => {
    return name.trim() !== '' && parseFloat(price) > 0;
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Add Custom Item</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <label htmlFor="name">Item Name</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="description">Description (Optional)</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
            ></textarea>
          </FormGroup>
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="add-button" 
            onClick={handleAddItem}
            disabled={!isFormValid()}
          >
            Add Item
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CustomItemModal;
