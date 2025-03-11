// Product Service
// This service handles product-related operations

// Get all products from localStorage
export const getProducts = () => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [
    // Default products for demo
    {
      id: 'p1',
      name: 'Smartphone X',
      description: 'Latest model with advanced features',
      price: 599.99,
      cost: 399.99,
      sku: 'SP-X-001',
      barcode: '123456789012',
      category: 'electronics',
      tags: ['smartphone', 'mobile', 'tech'],
      stockQuantity: 25,
      lowStockThreshold: 5,
      vendor: 'TechCorp',
      image: 'https://via.placeholder.com/150?text=Smartphone',
      createdAt: '2023-01-10T08:30:00Z',
      updatedAt: '2023-01-10T08:30:00Z'
    },
    {
      id: 'p2',
      name: 'Wireless Earbuds',
      description: 'Bluetooth earbuds with noise cancellation',
      price: 129.99,
      cost: 79.99,
      sku: 'WE-B-002',
      barcode: '223456789012',
      category: 'electronics',
      tags: ['audio', 'wireless', 'earbuds'],
      stockQuantity: 40,
      lowStockThreshold: 10,
      vendor: 'AudioTech',
      image: 'https://via.placeholder.com/150?text=Earbuds',
      createdAt: '2023-01-15T09:45:00Z',
      updatedAt: '2023-01-15T09:45:00Z'
    },
    {
      id: 'p3',
      name: 'Smart Watch',
      description: 'Fitness tracker and smartwatch',
      price: 199.99,
      cost: 129.99,
      sku: 'SW-F-003',
      barcode: '323456789012',
      category: 'electronics',
      tags: ['wearable', 'fitness', 'watch'],
      stockQuantity: 30,
      lowStockThreshold: 8,
      vendor: 'TechCorp',
      image: 'https://via.placeholder.com/150?text=SmartWatch',
      createdAt: '2023-01-20T10:15:00Z',
      updatedAt: '2023-01-20T10:15:00Z'
    },
    {
      id: 'p4',
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      cost: 899.99,
      sku: 'LP-X-004',
      barcode: '423456789012',
      category: 'electronics',
      tags: ['computer', 'laptop', 'professional'],
      stockQuantity: 15,
      lowStockThreshold: 3,
      vendor: 'ComputeTech',
      image: 'https://via.placeholder.com/150?text=Laptop',
      createdAt: '2023-01-25T11:30:00Z',
      updatedAt: '2023-01-25T11:30:00Z'
    },
    {
      id: 'p5',
      name: 'Bluetooth Speaker',
      description: 'Portable wireless speaker with deep bass',
      price: 79.99,
      cost: 49.99,
      sku: 'BS-S-005',
      barcode: '523456789012',
      category: 'electronics',
      tags: ['audio', 'speaker', 'bluetooth'],
      stockQuantity: 50,
      lowStockThreshold: 10,
      vendor: 'AudioTech',
      image: 'https://via.placeholder.com/150?text=Speaker',
      createdAt: '2023-02-01T12:45:00Z',
      updatedAt: '2023-02-01T12:45:00Z'
    },
    {
      id: 'p6',
      name: 'Casual T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 24.99,
      cost: 12.99,
      sku: 'CT-M-006',
      barcode: '623456789012',
      category: 'clothing',
      tags: ['apparel', 't-shirt', 'casual'],
      stockQuantity: 100,
      lowStockThreshold: 20,
      vendor: 'FashionCo',
      image: 'https://via.placeholder.com/150?text=TShirt',
      createdAt: '2023-02-05T13:15:00Z',
      updatedAt: '2023-02-05T13:15:00Z'
    },
    {
      id: 'p7',
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans',
      price: 49.99,
      cost: 29.99,
      sku: 'DJ-L-007',
      barcode: '723456789012',
      category: 'clothing',
      tags: ['apparel', 'jeans', 'denim'],
      stockQuantity: 75,
      lowStockThreshold: 15,
      vendor: 'FashionCo',
      image: 'https://via.placeholder.com/150?text=Jeans',
      createdAt: '2023-02-10T14:30:00Z',
      updatedAt: '2023-02-10T14:30:00Z'
    },
    {
      id: 'p8',
      name: 'Running Shoes',
      description: 'Lightweight shoes for runners',
      price: 89.99,
      cost: 59.99,
      sku: 'RS-9-008',
      barcode: '823456789012',
      category: 'clothing',
      tags: ['footwear', 'running', 'athletic'],
      stockQuantity: 60,
      lowStockThreshold: 12,
      vendor: 'SportGear',
      image: 'https://via.placeholder.com/150?text=Shoes',
      createdAt: '2023-02-15T15:45:00Z',
      updatedAt: '2023-02-15T15:45:00Z'
    },
    {
      id: 'p9',
      name: 'Coffee Maker',
      description: 'Automatic drip coffee maker',
      price: 69.99,
      cost: 39.99,
      sku: 'CM-D-009',
      barcode: '923456789012',
      category: 'home',
      tags: ['kitchen', 'appliance', 'coffee'],
      stockQuantity: 35,
      lowStockThreshold: 7,
      vendor: 'HomeGoods',
      image: 'https://via.placeholder.com/150?text=CoffeeMaker',
      createdAt: '2023-02-20T16:15:00Z',
      updatedAt: '2023-02-20T16:15:00Z'
    },
    {
      id: 'p10',
      name: 'Blender',
      description: 'High-speed blender for smoothies',
      price: 49.99,
      cost: 29.99,
      sku: 'BL-P-010',
      barcode: '023456789012',
      category: 'home',
      tags: ['kitchen', 'appliance', 'blender'],
      stockQuantity: 45,
      lowStockThreshold: 9,
      vendor: 'HomeGoods',
      image: 'https://via.placeholder.com/150?text=Blender',
      createdAt: '2023-02-25T17:30:00Z',
      updatedAt: '2023-02-25T17:30:00Z'
    }
  ];
};

// Add a new product
export const addProduct = (product) => {
  const products = getProducts();
  
  // Generate a unique ID if not provided
  const newProduct = {
    ...product,
    id: product.id || `p-${Date.now()}`,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const updatedProducts = [...products, newProduct];
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return newProduct;
};

// Update an existing product
export const updateProduct = (productId, updatedData) => {
  const products = getProducts();
  const updatedProducts = products.map(product => 
    product.id === productId 
      ? { 
          ...product, 
          ...updatedData, 
          updatedAt: new Date().toISOString() 
        } 
      : product
  );
  
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return updatedProducts.find(product => product.id === productId);
};

// Delete a product
export const deleteProduct = (productId) => {
  const products = getProducts();
  const updatedProducts = products.filter(product => product.id !== productId);
  
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  return updatedProducts;
};

// Get a single product by ID
export const getProductById = (productId) => {
  const products = getProducts();
  return products.find(product => product.id === productId);
};

// Search products by name, SKU, or barcode
export const searchProducts = (query) => {
  if (!query) return [];
  
  const products = getProducts();
  const lowerCaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    (product.sku && product.sku.toLowerCase().includes(lowerCaseQuery)) ||
    (product.barcode && product.barcode.includes(query)) ||
    (product.description && product.description.toLowerCase().includes(lowerCaseQuery))
  );
};

// Filter products by various criteria
export const filterProducts = (filters = {}) => {
  let products = getProducts();
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    products = products.filter(product => product.category === filters.category);
  }
  
  // Filter by vendor
  if (filters.vendor) {
    products = products.filter(product => product.vendor === filters.vendor);
  }
  
  // Filter by price range
  if (filters.minPrice !== undefined) {
    products = products.filter(product => product.price >= filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    products = products.filter(product => product.price <= filters.maxPrice);
  }
  
  // Filter by stock status
  if (filters.stockStatus === 'inStock') {
    products = products.filter(product => product.stockQuantity > 0);
  } else if (filters.stockStatus === 'outOfStock') {
    products = products.filter(product => product.stockQuantity === 0);
  } else if (filters.stockStatus === 'lowStock') {
    products = products.filter(product => 
      product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold
    );
  }
  
  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    products = products.filter(product => 
      product.tags && filters.tags.some(tag => product.tags.includes(tag))
    );
  }
  
  // Sort products
  if (filters.sortBy) {
    const sortField = filters.sortBy.field;
    const sortDirection = filters.sortBy.direction || 'asc';
    
    products.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      // Handle date comparison
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return products;
};

// Get products by category
export const getProductsByCategory = (category) => {
  if (!category) return getProducts();
  
  const products = getProducts();
  return products.filter(product => product.category === category);
};

// Get products by vendor
export const getProductsByVendor = (vendor) => {
  if (!vendor) return getProducts();
  
  const products = getProducts();
  return products.filter(product => product.vendor === vendor);
};

// Get products with low stock
export const getLowStockProducts = () => {
  const products = getProducts();
  return products.filter(product => 
    product.stockQuantity <= product.lowStockThreshold
  );
};

// Get out of stock products
export const getOutOfStockProducts = () => {
  const products = getProducts();
  return products.filter(product => product.stockQuantity === 0);
};

// Update product stock quantity
export const updateProductStock = (productId, newQuantity) => {
  const product = getProductById(productId);
  if (!product) return null;
  
  return updateProduct(productId, { stockQuantity: newQuantity });
};

// Adjust product stock (add or subtract)
export const adjustProductStock = (productId, adjustment) => {
  const product = getProductById(productId);
  if (!product) return null;
  
  const newQuantity = Math.max(0, product.stockQuantity + adjustment);
  return updateProduct(productId, { stockQuantity: newQuantity });
};

// Get total number of products
export const getProductCount = () => {
  return getProducts().length;
};

// Get total inventory value (cost)
export const getTotalInventoryValue = () => {
  const products = getProducts();
  return products.reduce((total, product) => 
    total + (product.cost * product.stockQuantity), 0
  );
};

// Get total inventory retail value (price)
export const getTotalInventoryRetailValue = () => {
  const products = getProducts();
  return products.reduce((total, product) => 
    total + (product.price * product.stockQuantity), 0
  );
};

// Import products from CSV or JSON
export const importProducts = (productsData) => {
  const existingProducts = getProducts();
  
  // Merge with existing products, avoiding duplicates by SKU
  const skuMap = new Map();
  existingProducts.forEach(product => {
    if (product.sku) {
      skuMap.set(product.sku.toLowerCase(), product);
    }
  });
  
  const newProducts = [];
  
  productsData.forEach(product => {
    if (product.sku) {
      const lowerCaseSku = product.sku.toLowerCase();
      
      if (skuMap.has(lowerCaseSku)) {
        // Update existing product
        const existingProduct = skuMap.get(lowerCaseSku);
        const updatedProduct = {
          ...existingProduct,
          ...product,
          id: existingProduct.id, // Keep the original ID
          updatedAt: new Date().toISOString()
        };
        
        skuMap.set(lowerCaseSku, updatedProduct);
      } else {
        // Add new product
        const newProduct = {
          ...product,
          id: product.id || `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        skuMap.set(lowerCaseSku, newProduct);
        newProducts.push(newProduct);
      }
    } else {
      // Product without SKU, just add as new
      const newProduct = {
        ...product,
        id: product.id || `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      newProducts.push(newProduct);
    }
  });
  
  // Combine all products and save
  const allProducts = [...Array.from(skuMap.values()), ...newProducts.filter(p => !p.sku)];
  localStorage.setItem('products', JSON.stringify(allProducts));
  
  return {
    total: allProducts.length,
    added: newProducts.length,
    updated: productsData.length - newProducts.length
  };
};

// Export products to JSON format
export const exportProducts = () => {
  return getProducts();
};
