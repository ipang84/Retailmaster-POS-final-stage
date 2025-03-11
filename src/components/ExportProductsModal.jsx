import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getProducts, filterProducts } from '../services/productService';
import { productsToCSV, downloadFile } from '../services/importExportService';

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

const FilterOptions = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .filter-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    
    select {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
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
    }<boltAction type="file" filePath="src/components/ExportProductsModal.jsx">
      &:hover {
        background-color: #0055cc;
      }
    }
  }
`;

function ExportProductsModal({ isOpen, onClose }) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [exportStatus, setExportStatus] = useState(null);
  const [productCount, setProductCount] = useState(0);
  
  // Get categories and vendors for filter dropdowns
  const allProducts = getProducts();
  const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);
  const vendors = [...new Set(allProducts.map(p => p.vendor))].filter(Boolean);
  
  // Update product count when filters change
  React.useEffect(() => {
    const filters = {};
    
    if (exportScope === 'filtered') {
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      if (selectedVendor !== 'all') filters.vendor = selectedVendor;
      if (selectedStatus !== 'all') filters.status = selectedStatus;
    }
    
    const filteredProducts = exportScope === 'all' ? allProducts : filterProducts(filters);
    setProductCount(filteredProducts.length);
  }, [exportScope, selectedCategory, selectedVendor, selectedStatus, allProducts]);
  
  if (!isOpen) return null;
  
  const handleExport = () => {
    try {
      // Apply filters if needed
      let productsToExport = allProducts;
      
      if (exportScope === 'filtered') {
        const filters = {};
        if (selectedCategory !== 'all') filters.category = selectedCategory;
        if (selectedVendor !== 'all') filters.vendor = selectedVendor;
        if (selectedStatus !== 'all') filters.status = selectedStatus;
        
        productsToExport = filterProducts(filters);
      }
      
      if (productsToExport.length === 0) {
        setExportStatus({
          type: 'error',
          message: 'No products match the selected filters. Please adjust your filters and try again.'
        });
        return;
      }
      
      // Generate CSV
      const csvContent = productsToCSV(productsToExport);
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0];
      const filename = `products_export_${date}.csv`;
      
      // Download file
      downloadFile(csvContent, filename, 'text/csv');
      
      setExportStatus({
        type: 'success',
        message: `Successfully exported ${productsToExport.length} products to ${filename}`
      });
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error exporting products:', error);
      setExportStatus({
        type: 'error',
        message: 'An error occurred while exporting products. Please try again.'
      });
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Export Products</h2>
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
          
          <ExportOptions>
            <h3>Export Scope</h3>
            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="exportScope" 
                  value="all" 
                  checked={exportScope === 'all'}
                  onChange={() => setExportScope('all')}
                />
                All Products
              </label>
              <div className="option-description">
                Export all products in your inventory.
              </div>
            </div>
            <div className="option">
              <label>
                <input 
                  type="radio" 
                  name="exportScope" 
                  value="filtered" 
                  checked={exportScope === 'filtered'}
                  onChange={() => setExportScope('filtered')}
                />
                Filtered Products
              </label>
              <div className="option-description">
                Export only products matching the filters below.
              </div>
            </div>
          </ExportOptions>
          
          {exportScope === 'filtered' && (
            <FilterOptions>
              <h3>Filters</h3>
              <div className="filter-row">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                >
                  <option value="all">All Vendors</option>
                  {vendors.map((vendor, index) => (
                    <option key={index} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-row">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </FilterOptions>
          )}
          
          <ExportSummary>
            <div className="summary-title">Products to Export</div>
            <div className="summary-count">{productCount}</div>
            <div className="summary-description">
              {exportScope === 'all' 
                ? 'All products in your inventory will be exported.' 
                : 'Products matching your selected filters will be exported.'}
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
            Export Products
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ExportProductsModal;
