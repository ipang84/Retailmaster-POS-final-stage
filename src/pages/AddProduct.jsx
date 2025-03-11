import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiUpload, FiInfo, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { addProduct } from '../services/productService';
import { getCategories, getCategoryById } from '../services/categoryService';
import { getVendors, getVendorById } from '../services/vendorService';
import CategoryModal from '../components/CategoryModal';
import VendorModal from '../components/VendorModal';

const Container = styled.div`
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  .back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
    margin-right: 12px;
    text-decoration: none;
    
    svg {
      margin-right: 6px;
    }
  }
  
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin<boltAction type="file" filePath="src/pages/AddProduct.jsx">  margin-bottom: 12px;
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #555;
    font-size: 12px;
  }
  
  input[type="text"],
  input[type="number"],
  textarea,
  select {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 13px;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color, #0066ff);
    }
  }
  
  textarea {
    min-height: 60px;
    resize: vertical;
  }
  
  .input-with-action {
    display: flex;
    gap: 6px;
    
    input, select {
      flex: 1;
    }
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 8px;
      color: var(--primary-color, #0066ff);
      cursor: pointer;
      font-size: 12px;
      
      &:hover {
        border-color: var(--primary-color, #0066ff);
      }
      
      svg {
        margin-right: 3px;
        font-size: 12px;
      }
    }
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-size: 12px;
    
    input[type="checkbox"] {
      margin-right: 6px;
    }
  }
  
  .helper-text {
    font-size: 11px;
    color: #777;
    margin-top: 3px;
  }
  
  .input-group {
    display: flex;
    align-items: center;
    
    .currency-symbol {
      margin-right: 6px;
      color: #555;
    }
    
    .percentage-symbol {
      margin-left: 6px;
      color: #555;
    }
  }
`;

// Simplified pricing layout
const PricingSection = styled.div`
  .pricing-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .pricing-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .form-group {
    margin-bottom: 0;
    
    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #555;
      font-size: 12px;
    }
    
    input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }
    
    .percentage-input {
      position: relative;
      
      input {
        padding-right: 20px;
      }
      
      .percentage-symbol {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #555;
        font-size: 12px;
      }
    }
  }
`;

const MediaUpload = styled.div`
  border: 1px dashed #ddd;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    border-color: var(--primary-color, #0066ff);
  }
  
  .upload-icon {
    font-size: 20px;
    color: #999;
    margin-bottom: 8px;
  }
  
  .upload-text {
    font-weight: 500;
    color: #555;
    margin-bottom: 4px;
    font-size: 12px;
  }
  
  .upload-hint {
    font-size: 11px;
    color: #999;
  }

  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .remove-image {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const SuccessMessage = styled.div`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 13px;
`;

// Compact right side sections
const CompactSection = styled(FormSection)`
  padding: 10px;
  
  .section-title {
    font-size: 13px;
    margin-bottom: 8px;
  }
  
  ${FormGroup} {
    margin-bottom: 8px;
  }
`;

// Combined right side sections
const CombinedSection = styled(FormSection)`
  .section-divider {
    border-top: 1px solid #eee;
    margin: 10px 0;
    padding-top: 10px;
  }
`;

function AddProduct() {
  const navigate = useNavigate();
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [hasSKU, setHasSKU] = useState(true);
  const [isService, setIsService] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Category and vendor state
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vendor: '',
    tags: '',
    price: '',
    minPrice: '',
    cost: '',
    status: 'active',
    condition: 'new',
    quantity: '0',
    sku: '',
    barcode: '',
    category: ''
  });
  
  // Load categories and vendors on component mount
  useEffect(() => {
    loadCategories();
    loadVendors();
  }, []);
  
  const loadCategories = () => {
    const categoriesData = getCategories();
    setCategories(categoriesData);
  };
  
  const loadVendors = () => {
    const vendorsData = getVendors();
    setVendors(vendorsData);
  };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  const calculateProfit = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    return (price - cost).toFixed(2);
  };
  
  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price === 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleEditVendor = () => {
    const selectedVendorId = formData.vendor;
    if (selectedVendorId) {
      const vendor = vendors.find(v => v.id === selectedVendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setShowVendorModal(true);
      }
    } else {
      // If no vendor is selected, open the modal to add a new one
      setSelectedVendor(null);
      setShowVendorModal(true);
    }
  };
  
  // Generate a simple SKU based on product details (max 6 digits/letters)
  const generateSKU = () => {
    const productName = formData.title.trim();
    
    if (!productName) return '';
    
    // Get first 2 letters of product name (uppercase)
    const namePrefix = productName.substring(0, 2).toUpperCase();
    
    // Add a random 4-digit number (to stay within 6 character limit)
    const randomNum = Math.floor(1000 + Math.random() * 9000).toString().substring(0, 4);
    
    // Combine to create a 6-character SKU
    return `${namePrefix}${randomNum}`;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate SKU if it's empty and hasSKU is true
    let skuValue = formData.sku;
    if (hasSKU && (!skuValue || skuValue.trim() === '')) {
      skuValue = generateSKU();
    }
    
    // Prepare product data
    const productData = {
      name: formData.title,
      description: formData.description,
      vendor: formData.vendor,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      status: formData.status,
      condition: formData.condition,
      inventory: trackQuantity ? parseInt(formData.quantity) || 0 : null,
      sku: hasSKU ? skuValue : null,
      barcode: hasSKU ? formData.barcode : null,
      category: formData.category,
      isService: isService,
      image: imagePreview || 'https://via.placeholder.com/40' // Use uploaded image or placeholder
    };
    
    // Add product to storage
    addProduct(productData);
    
    // Show success message
    setSuccess(true);
    
    // Reset form or redirect after delay
    setTimeout(() => {
      navigate('/products');
    }, 1500);
  };
  
  return (
    <Container>
      <Header>
        <Link to="/products" className="back-button">
          <FiArrowLeft />
          Back
        </Link>
        <h1>Add Product</h1>
      </Header>
      
      {success && (
        <SuccessMessage>
          Product added successfully! Redirecting to products list...
        </SuccessMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormLayout>
          <div className="left-column">
            <FormSection>
              <FormGroup>
                <label htmlFor="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  placeholder="Enter product title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="description">Short description</label>
                <textarea 
                  id="description" 
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="vendor">Vendor</label>
                <div className="input-with-action">
                  <select 
                    id="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={handleEditVendor}>
                    <FiEdit2 />
                    Edit
                  </button>
                </div>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="tags">Product tags</label>
                <input 
                  type="text" 
                  id="tags" 
                  placeholder="Add tag (comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <label>Media</label>
                {imagePreview ? (
                  <ImagePreview>
                    <img src={imagePreview} alt="Product preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={handleRemoveImage}
                    >
                      <FiX />
                    </button>
                  </ImagePreview>
                ) : (
                  <MediaUpload>
                    <FiUpload className="upload-icon" />
                    <div className="upload-text">Drag and drop files or click to browse</div>
                    <div className="upload-hint">Max: 5 MB each</div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                  </MediaUpload>
                )}
              </FormGroup>
            </FormSection>
            
            {/* Updated Pricing Section */}
            <FormSection>
              <div className="section-title">Pricing</div>
              
              <PricingSection>
                <div className="pricing-row">
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input 
                      type="number" 
                      id="price" 
                      placeholder="0" 
                      min="0" 
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="minPrice">Min Price</label>
                    <input 
                      type="number" 
                      id="minPrice" 
                      placeholder="0" 
                      min="0" 
                      step="0.01"
                      value={formData.minPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cost">Cost</label>
                    <input 
                      type="number" 
                      id="cost" 
                      placeholder="0" 
                      min="0" 
                      step="0.01"
                      value={formData.cost}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="pricing-row-2">
                  <div className="form-group">
                    <label htmlFor="profit">Profit</label>
                    <input 
                      type="number" 
                      id="profit" 
                      placeholder="0" 
                      min="0" 
                      step="0.01" 
                      value={calculateProfit()}
                      disabled 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="margin">Margin</label>
                    <div className="percentage-input">
                      <input 
                        type="number" 
                        id="margin" 
                        placeholder="0" 
                        min="0"
                        value={calculateMargin()}
                        disabled
                      />
                      <span className="percentage-symbol">%</span>
                    </div>
                  </div>
                </div>
              </PricingSection>
            </FormSection>
          </div>
          
          <div className="right-column">
            {/* Combined Status, Inventory and Organization sections */}
            <CombinedSection>
              <div className="section-title">Product Details</div>
              
              {/* Status & Condition */}
              <FormGroup>
                <label htmlFor="status">Status</label>
                <select 
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="condition">Condition</label>
                <select 
                  id="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </FormGroup>
              
              {/* Inventory Section */}
              <div className="section-divider"></div>
              
              <FormGroup>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="track-quantity" 
                    checked={trackQuantity}
                    onChange={() => setTrackQuantity(!trackQuantity)}
                  />
                  <label htmlFor="track-quantity">Track Quantity</label>
                </div>
              </FormGroup>
              
              {trackQuantity && (
                <FormGroup>
                  <label htmlFor="quantity">Quantity</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    placeholder="0" 
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="is-service" 
                      checked={isService}
                      onChange={() => setIsService(!isService)}
                    />
                    <label htmlFor="is-service">Mark as service</label>
                  </div>
                </FormGroup>
              )}
              
              <FormGroup>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="has-sku" 
                    checked={hasSKU}
                    onChange={() => setHasSKU(!hasSKU)}
                  />
                  <label htmlFor="has-sku">Has SKU or barcode</label>
                </div>
              </FormGroup>
              
              {hasSKU && (
                <>
                  <FormGroup>
                    <label htmlFor="sku">SKU</label>
                    <input 
                      type="text" 
                      id="sku" 
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={handleInputChange}
                    />
                    <div className="helper-text">Auto-generated if empty</div>
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="barcode">Barcode</label>
                    <input 
                      type="text" 
                      id="barcode" 
                      placeholder="Enter barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </>
              )}
              
              {/* Organization Section */}
              <div className="section-divider"></div>
              
              <FormGroup>
                <label htmlFor="category">Category</label>
                <div className="input-with-action">
                  <select 
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setShowCategoryModal(true)}>
                    <FiPlus />
                    New
                  </button>
                </div>
              </FormGroup>
            </CombinedSection>
            
            <SaveButton type="submit">Save</SaveButton>
          </div>
        </FormLayout>
      </form>
      
      {/* Category Modal */}
      <CategoryModal 
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={loadCategories}
      />
      
      {/* Vendor Modal */}
      <VendorModal 
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        vendor={selectedVendor}
        onSave={loadVendors}
      />
    </Container>
  );
}

export default AddProduct;
