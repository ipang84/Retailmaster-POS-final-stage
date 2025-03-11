import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getCustomers } from '../services/customerService';
import { customersToCSV, downloadFile } from '../services/importExportService';

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
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const ExportOptions = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .option {
    margin-bottom: 12px;
    
    label {
      display: flex;
      align-items: center;
      font-weight: 500;
      
      input {
        margin-right: 8px;
      }
    }
    
    .option-description {
      margin-left: 24px;
      font-size: 13px;
      color: #666;
    }
  }
`;

const ExportSummary = styled.div`
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  
  .summary-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .summary-count {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 8px;
  }
  
  .summary-description {
    font-size: 13px;
    color: #666;
  }
`;

const ExportStatus = styled.div`
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
  &.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  &.error {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .status-icon {
    margin-right: 12px;
  }
  
  .status-message {
    flex: 1;
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
    
    &.cancel {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        border-color: #999;
        color: #333;
      }
    }
    
    &.export {
      background-color: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 8px;
      }
      
      &:hover {
        background-color: #0055cc;
      }
    }
  }
`;

function ExportCustomersModal({ isOpen, onClose }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportStatus, setExportStatus] = useState(null);
  
  // Get all customers
  const allCustomers = getCustomers();
  
  if (!isOpen) return null;
  
  const handleExport = () => {
    try {
      if (allCustomers.length === 0) {
        setExportStatus({
          type: 'error',
          message: 'No customers to export. Please add customers first.'
        });
        return;
      }
      
      // Generate CSV
      const csvContent = customersToCSV(allCustomers);
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `customers_export_${date}.csv`;
      
      // Download file
      downloadFile(csvContent, filename, 'text/csv');
      
      setExportStatus({
        type: 'success',
        message: `Successfully exported ${allCustomers.length} customers to ${filename}`
      });
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error exporting customers:', error);
      setExportStatus({
        type: 'error',
        message: 'An error occurred while exporting customers. Please try again.'
      });
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Export Customers</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <ExportOptions>
            <h3>Export Format</h3>
            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="csv" 
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                CSV (Comma Separated Values)
              </label>
              <div className="option-description">
                Export as CSV file, compatible with Excel and other spreadsheet applications.
              </div>
            </div>
          </ExportOptions>
          
          <ExportSummary>
            <div className="summary-title">Customers to Export</div>
            <div className="summary-count">{allCustomers.length}</div>
            <div className="summary-description">
              All customers in your database will be exported.
            </div>
          </ExportSummary>
          
          {exportStatus && (
            <ExportStatus className={exportStatus.type}>
              <div className="status-icon">
                {exportStatus.type === 'success' && <FiCheckCircle size={20} />}
                {exportStatus.type === 'error' && <FiAlertCircle size={20} />}
              </div>
              <div className="status-message">
                {exportStatus.message}
              </div>
            </ExportStatus>
          )}
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="export" onClick={handleExport}>
            <FiDownload size={16} />
            Export Customers
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ExportCustomersModal;
