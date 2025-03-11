// Category Service
// This service handles category-related operations

// Get all categories from localStorage
export const getCategories = () => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [
    // Default categories for demo
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'clothing',
      name: 'Clothing',
      description: 'Apparel and fashion items',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'home',
      name: 'Home & Kitchen',
      description: 'Home goods and kitchen appliances',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      description: 'Beauty products and health items',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'food',
      name: 'Food & Grocery',
      description: 'Food items and groceries',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      description: 'Toys, games, and entertainment items',
      createdAt: '2023-01-01T00:00:00Z'
    }
  ];
};

// Add a new category
export const addCategory = (category) => {
  const categories = getCategories();
  
  // Generate a unique ID if not provided
  const newCategory = {
    ...category,
    id: category.id || category.name.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date().toISOString()
  };
  
  const updatedCategories = [...categories, newCategory];
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
  return newCategory;
};

// Update an existing category
export const updateCategory = (categoryId, updatedData) => {
  const categories = getCategories();
  const updatedCategories = categories.map(category => 
    category.id === categoryId 
      ? { ...category, ...updatedData } 
      : category
  );
  
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
  return updatedCategories.find(category => category.id === categoryId);
};

// Delete a category
export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  const updatedCategories = categories.filter(category => category.id !== categoryId);
  
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
  return updatedCategories;
};

// Get a single category by ID
export const getCategoryById = (categoryId) => {
  const categories = getCategories();
  return categories.find(category => category.id === categoryId);
};

// Get category name by ID
export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.name : 'Uncategorized';
};

// Check if a category exists
export const categoryExists = (categoryName) => {
  const categories = getCategories();
  return categories.some(category => 
    category.name.toLowerCase() === categoryName.toLowerCase()
  );
};
