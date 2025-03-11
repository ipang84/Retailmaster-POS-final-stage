import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FiX, FiUpload, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { csvToCustomers } from '../services/importExportService';
import { addCustomer, getCustomers } from '../services/customerService';

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
  max-width: 600px;
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

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  .upload-icon {
    font-size: 32px;
    color: #999;
    margin-bottom: 12px;
  }
  
  .upload-text {
    font-weight: 500;
    color: #555;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    font-size: 13px;
    color: #999;
  }
  
  input[type="file"] {
    display: none;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  margin-bottom: 20px;
  
  .file-icon {
    margin-right: 12px;
    color: #666;
  }
  
  .file-details {
    flex: 1;
    
    .file-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .file-meta {
      font-size: 12px;
      color: #666;
    }
  }
  
  .remove-button {
    background: none;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #b71c1c;
    }
  }
`;

const ImportOptions = styled.div`
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

const ImportPreview = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    
    .count-badge {
      margin-left: 8px;
      background-color: #e3f2fd;
      color: #1976d2;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
    }
  }
  
  .preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      font-weight: 600;
      color: #555;
      background-color: #f9f9f9;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
  }
  
  .preview-message {
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 6px;
    font-size: 14px;
    color: #666;
    text-align: center;
  }
`;

const ImportStatus = styled.div`
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
  
  &.info {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .status-icon {
    margin-right: 12px;
  }
  
  .status-message {
    flex: 1;
    
    p {
      margin: 0 0 4px 0;
      
      &:last-child {
        margin-bottom: 0;
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
    
    &.cancel {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      
      &:hover {
        border-color: #999;
        color: #333;
      }
    }
    
    &.import {
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
      
      &:disabled {
        background-color: #a5c0e5;
        cursor: not-allowed;
      }
    }
  }
`;

function ImportCustomersModal({ isOpen, onClose, onImportComplete }) {
  const [file, setFile] = useState(null);
  const [importOption, setImportOption] = useState('add');
  const [previewData, setPreviewData] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  
  if (!isOpen) return null;
  
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      setImportStatus({
        type: 'error',
        message: 'Invalid file format. Please upload a CSV file.'
      });
      return;
    }
    
    setFile(selectedFile);
    setImportStatus(null);
    
    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvContent = event.target.result;
        
        // Parse CSV to customers
        const customers = csvToCustomers(csvContent);
        
        if (customers.length === 0) {
          setImportStatus({
            type: 'error',
            message: 'No valid customers found in the CSV file.'
          });
          return;
        }
        
        // Set preview data (first 5 customers)
        setPreviewData(customers.slice(0, 5));
        
        setImportStatus({
          type: 'info',
          message: `Found ${customers.length} customers in the CSV file.`
        });
      };
      
      reader.onerror = () => {
        setImportStatus({
          type: 'error',
          message: 'Error reading the file. Please try again.'
        });
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error processing file:', error);
      setImportStatus({
        type: 'error',
        message: 'Error processing the file. Please try again.'
      });
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setImportStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setIsImporting(true);
    setImportStatus({
      type: 'info',
      message: 'Importing customers...'
    });
    
    try {
      // Read file content
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const csvContent = event.target.result;
        
        // Parse CSV to customers
        const customersToImport = csvToCustomers(csvContent);
        
        if (customersToImport.length === 0) {
          setImportStatus({
            type: 'error',
            message: 'No valid customers found in the CSV file.'
          });
          setIsImporting(false);
          return;
        }
        
        // Get existing customers
        const existingCustomers = getCustomers();
        
        // Process based on import option
        let importedCount = 0;
        let skippedCount = 0;
        let updatedCount = 0;
        
        if (importOption === 'add') {
          // Add all customers as new
          customersToImport.forEach(customer => {
            // Generate new ID to avoid conflicts
            const newCustomer = { ...customer };
            delete newCustomer.id;
            addCustomer(newCustomer);
            importedCount++;
          });
        } else if (importOption === 'update') {
          // Update existing customers, add new ones
          customersToImport.forEach(customer => {
            const existingCustomer = customer.id ? 
              existingCustomers.find(c => c.id === customer.id) : 
              existingCustomers.find(c => c.email === customer.email);
            
            if (existingCustomer) {
              // Update existing customer
              const updatedCustomer = { ...existingCustomer, ...customer };
              addCustomer(updatedCustomer); // addCustomer will update if ID exists
              updatedCount++;
            } else {
              // Add as new customer
              const newCustomer = { ...customer };
              delete newCustomer.id;
              addCustomer(newCustomer);
              importedCount++;
            }
          });
        } else if (importOption === 'replace') {
          // Replace all customers
          // For now, we'll just add all as new
          customersToImport.forEach(customer => {
            const newCustomer = { ...customer };
            delete newCustomer.id;
            addCustomer(newCustomer);
            importedCount++;
          });
        }
        
        setImportStatus({
          type: 'success',
          message: `Import completed successfully. ${importedCount} customers added, ${updatedCount} customers updated, ${skippedCount} customers skipped.`
        });
        
        // Notify parent component
        onImportComplete();
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
        }, 2000);
      };
      
      reader.onerror = () => {
        setImportStatus({
          type: 'error',
          message: 'Error reading the file. Please try again.'
        });
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing customers:', error);
      setImportStatus({
        type: 'error',
        message: 'Error importing customers. Please try again.'
      });
      setIsImporting(false);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Import Customers</h2>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </ModalHeader>
        
        <ModalBody>
          {!file ? (
            <UploadArea onClick={handleUploadClick}>
              <FiUpload className="upload-icon" />
              <div className="upload-text">Drag and drop a CSV file or click to browse</div>
              <div className="upload-hint">
                CSV file should include headers: fullName, email, phone, companyName, address, city, state, zipCode, country, notes
              </div>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
            </UploadArea>
          ) : (
            <FileInfo>
              <div className="file-icon">
                <FiUpload size={24} />
              </div>
              <div className="file-details">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  {(file.size / 1024).toFixed(2)} KB • CSV
                </div>
              </div>
              <button className="remove-button" onClick={handleRemoveFile}>
                <FiX size={18} />
              </button>
            </FileInfo>
          )}
          
          {importStatus && (
            <ImportStatus className={importStatus.type}>
              <div className="status-icon">
                {importStatus.type === 'success' && <FiCheckCircle size={20} />}
                {importStatus.type === 'error' && <FiAlertCircle size={20} />}
                {importStatus.type === 'info' && <FiInfo size={20} />}
              </div>
              <div className="status-message">
                <p>{importStatus.message}</p>
              </div>
            </ImportStatus>
          )}
          
          {file && (
            <>
              <ImportOptions>
                <h3>Import Options</h3>
                <div className="option">
                  <label>
                    <input 
                      type="radio" 
                      name="importOption" 
                      value="add" 
                      checked={importOption === 'add'}
                      onChange={() => setImportOption('add')}
                    />
                    Add as new customers
                  </label>
                  <div className="option-description">
                    All customers in the CSV will be added as new customers.
                  </div>
                </div>
                <div className="option">
                  <label>
                    <input 
                      type="radio" 
                      name="importOption" 
                      value="update" 
                      checked={importOption === 'update'}
                      onChange={() => setImportOption('update')}
                    />
                    Update existing customers
                  </label>
                  <div className="option-description">
                    Customers with matching email addresses will be updated, new customers will be added.
                  </div>
                </div>
                <div className="option">
                  <label>
                    <input 
                      type="radio" 
                      name="importOption" 
                      value="replace" 
                      checked={importOption === 'replace'}
                      onChange={() => setImportOption('replace')}
                    />
                    Replace all customers
                  </label>
                  <div className="option-description">
                    All existing customers will be replaced with the imported customers.
                  </div>
                </div>
              </ImportOptions>
              
              <ImportPreview>
                <h3>
                  Preview 
                  {previewData.length > 0 && (
                    <span className="count-badge">
                      Showing {previewData.length} of {importStatus?.message?.match(/\d+/)?.[0] || '?'} customers
                    </span>
                  )}
                </h3>
                
                {previewData.length > 0 ? (
                  <div className="preview-table-container" style={{ overflowX: 'auto' }}>
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Company</th>
                          <th>Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((customer, index) => (
                          <tr key={index}>
                            <td>{customer.fullName}</td>
                            <td>{customer.email || 'N/A'}</td>
                            <td>{customer.phone || 'N/A'}</td>
                            <td>{customer.companyName || 'N/A'}</td>
                            <td>{customer.address ? `${customer.address}, ${customer.city || ''} ${customer.state || ''}` : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="preview-message">
                    No preview available. Please upload a valid CSV file.
                  </div>
                )}
              </ImportPreview>
            </>
          )}
        </ModalBody>
        
        <ModalFooter>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="import" 
            onClick={handleImport}
            disabled={!file || isImporting || previewData.length === 0}
          >
            <FiUpload size={16} />
            {isImporting ? 'Importing...' : 'Import Customers'}
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImportCustomersModal;
