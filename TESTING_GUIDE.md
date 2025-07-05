# E-Commerce Platform Testing Guide

## Quick Start Testing Steps

### 1. Login and Setup
1. Go to the homepage
2. Click "Sign Up" or "Login" 
3. Use demo credentials: username: `demo`, password: `demo123`
4. Navigate to Dashboard

### 2. Store Setup (If First Time)
1. Go to "Store Setup" from dashboard
2. Create your first store with:
   - Store name
   - Description
   - Choose template and colors

### 3. Test Categories Management
1. Click "Categories" in sidebar
2. Select your store from dropdown
3. Click "Add Category" 
4. Fill in:
   - Category name (e.g., "Electronics")
   - Description
   - Image URL (optional)
5. Click "Create Category"
6. Test editing by clicking "Edit" on any category

### 4. Test Product Management with File Upload
1. Click "Products" in sidebar
2. Click "Add Product"
3. Fill in product details:
   - Name: "Sample Product"
   - Description: "Test product description"
   - Price: 29.99
   - Stock: 100
   - Category: Select from dropdown
4. **Test File Upload**:
   - Drag and drop an image file (PNG, JPG, GIF)
   - Or click to browse and select image
   - Verify 5MB size limit
5. Click "Add Product"

### 5. Test Shopping Cart (Storefront View)
1. Go to "Store Settings" and get your store URL
2. Visit your storefront: `/store/{store-id}`
3. Browse products
4. Click "Add to Cart" on products
5. Click cart icon to open cart sidebar
6. Test:
   - Increase/decrease quantities
   - Remove items
   - View total price calculation

### 6. Test Discount Codes
1. Go to "Discounts" in sidebar
2. Click "Create Discount Code"
3. Fill in:
   - Code: "SAVE10"
   - Discount: 10% or $10
   - Usage limit: 100
   - Expiration date
4. Test applying code in cart checkout

### 7. Test Collections
1. In Categories page, click "Collections" tab
2. Create collection (e.g., "Featured Products")
3. Add products to collection
4. View collection on storefront

### 8. Test User Roles
1. Go to Admin panel (if admin user)
2. View all users and stores
3. Test role permissions

## Expected Results

### ✅ Categories
- Create, edit, delete categories
- Categories appear in product forms
- Categories organize products on storefront

### ✅ File Upload
- Drag and drop works
- File size validation (5MB limit)
- Supported formats: PNG, JPG, GIF
- Images display in product cards

### ✅ Shopping Cart
- Add/remove items
- Quantity updates
- Price calculations
- Persistent across sessions

### ✅ Discount Codes
- Percentage and fixed amount discounts
- Usage limits and expiration
- Applied during checkout

### ✅ Collections
- Group products by themes
- Display on storefront
- Easy management interface

## Troubleshooting

### If categories don't load:
- Ensure you have a store created
- Check store selection in dropdown

### If file upload fails:
- Check file size (max 5MB)
- Verify file format (PNG, JPG, GIF)
- Try different browser

### If cart is empty:
- Ensure you're on the storefront, not admin
- Check if products are published
- Clear browser cache

### If discount codes don't work:
- Verify code spelling
- Check expiration date
- Ensure usage limit not exceeded