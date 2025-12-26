# 🌾 Farm2Door — Workflow & Architecture

This document explains the high‑level architecture, data flow, and UI/UX behavior of the Farm2Door demo application. It is intended to help new developers onboard quickly and understand how the system is structured.

---

## 🏗 Architecture Overview

- **Framework:** React functional components with hooks.  
- **Bundler:** Vite (fast dev server, ES module support, optimized builds).  
- **State Management:** React Context API for app‑wide state.  
- **Persistence:** `localStorage` used for demo purposes (no backend).  

### Files of Interest
- `src/context/ProductContext.jsx`  
  - Central source of truth for products, cart, wishlist, and orders.  
  - Initializes from `src/data/products.js` or from `localStorage` if data exists.  
  - Provides domain functions such as `addToCart`, `updateCartQty`, `removeFromCart`, `createOrder`, and admin helpers (`adminAddProduct`, `adminEditProduct`, `adminDeleteProduct`).  

- `src/data/products.js`  
  - Sample product entries used to seed the app.  
  - Images must be either imported (preferred) or referenced via absolute paths in `public/assets/`.  

- `src/components/ProductCard.jsx`  
  - Displays a product tile with image, title, price, and actions (add to cart, wishlist).  
  - Clicking the product opens `ProductModal`.  

- `src/pages/Cart.jsx`  
  - Renders cart items in a list.  
  - Provides controls to update quantity, remove items, and checkout.  

---

## 🔄 Data Flow

1. **Initialization:**  
   - `products.js` provides the initial product list.  
   - On app startup, `ProductContext` loads state from `localStorage`.  
   - If no data exists, it falls back to the sample list and merges missing products.  

2. **User Interactions:**  
   - Actions such as add‑to‑cart or wishlist call context functions.  
   - Context functions update React state and trigger persistence effects.  

3. **Persistence:**  
   - State changes are saved to `localStorage` under keys:  
     - `farm2door_products`  
     - `farm2door_cart`  
     - `farm2door_wishlist`  
     - `farm2door_orders`  

4. **Checkout:**  
   - Creates an `order` record in `orders`.  
   - Clears the cart after successful checkout.  

---

## 🎨 UI/UX Behavior Notes

- **Product Images:**  
  - Components expect `product.image` to be either:  
    - A string URL (absolute path like `/assets/...` pointing to `public/`), or  
    - An imported module value (from `src/assets`, imported in `products.js`).  

- **Error Handling:**  
  - Components include `onError` fallbacks.  
  - Missing images display a placeholder (`/vite.svg`) to prevent layout reflow.  

- **Modal Behavior:**  
  - `ProductModal` renders a backdrop with `position: fixed` and high `z-index`.  
  - Ensures overlay behavior without shifting page content.  
  - Only one modal should be mounted at a time for smooth UX.  

- **Cart Layout:**  
  - Items displayed in a vertical column list.  
  - Each item is a flex row with:  
    - Product image  
    - Product info (title, price)  
    - Quantity controls  
    - Total price  
  - Subtle CSS transitions are used. Avoid toggling `display: none/block` rapidly to prevent flicker.  

---

## 👩‍💻 Common Developer Tasks

### Adding Images
- **Preferred Method:**  
  Import from `src/assets` in `src/data/products.js`:  
  ```js
  import myImg from '../assets/Gift/my.jpg';
  product.image = myImg;
  ```
  ✅ Ensures Vite bundles the image correctly.  

- **Alternative Method:**  
  Place file in `public/assets/` and reference by absolute path:  
  ```js
  product.image = '/assets/my.jpg';
  ```
  ⚠️ Works only if the file exists in `public/assets`.  

### Adding Products
- Update `src/data/products.js` with:  
  - `id` (unique identifier)  
  - `title` (product name)  
  - `price` (numeric value)  
  - `category` (string category name)  
  - `image` (imported asset or public path)  
  - `description` (short product description)  

### Admin Edits
- `ProductContext` includes admin helpers:  
  - `adminAddProduct`  
  - `adminEditProduct`  
  - `adminDeleteProduct`  
- All changes persist to `localStorage`.  

---

## 🛠 Debugging Tips

- **Images Not Loading:**  
  - Check DevTools → Network tab.  
  - If path is `/assets/...` but file is missing in `public/assets`, either move the file or import it in `products.js`.  

- **Overlapping/Flicker UI:**  
  - Inspect global CSS for conflicting rules.  
  - Watch for duplicated `body` or `:root` styles that enforce `display:flex` centering.  

- **Modal Flicker:**  
  - Ensure `ProductModal` uses a single `open` state.  
  - Avoid unnecessary unmounts triggered by parent re‑renders.  

---

## 🧪 Notes on Testing

- Run `npm run dev` and manually test:  
  - Add items to cart and open the `Cart` page.  
  - Click product to open modal and confirm only one modal is shown.  
  - Inspect images for broken links or placeholders.  

- **Automated Testing (Recommended):**  
  - Add unit tests for `ProductContext` operations (cart, wishlist, orders).  
  - Add visual regression tests for components (ProductCard, ProductModal, Cart).  
  - Consider CI integration for consistency.  

---

## 📌 Summary

Farm2Door is a demo e‑commerce app showcasing React + Vite with Context‑based state management.  
Key developer focus areas:  
- Image handling (import vs public assets)  
- Modal behavior (single instance, smooth UX)  
- Cart layout (flex rows, stock tracking)  
- Persistence (localStorage keys)  

This document provides the foundation for onboarding new contributors and maintaining consistent development practices.

---
