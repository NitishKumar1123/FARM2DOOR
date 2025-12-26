# 🌾 Farm2Door — Demo E-Commerce Store

Farm2Door is a small single‑page e‑commerce demo built with **React** and **Vite**.  
It demonstrates a compact storefront with product catalog, cart, wishlist, basic admin product management, and local persistence using `localStorage`.  

Designed for **learning, demos, and UI experimentation**, Farm2Door focuses on clean structure, safe image handling, and modal‑based product views.

---
<img width="943" height="502" alt="image" src="https://github.com/user-attachments/assets/12c5e7f4-9984-4ec0-8761-ddd1f7d4f84c" />

## 🚀 Features
- ⚡ Fast development with Vite + React  
- 🛒 Product catalog with images and categories  
- 📦 Cart with quantity management and stock tracking  
- 💖 Wishlist (save/unsave products)  
- 🛠 Simple admin CRUD for products (add / edit / delete)  
- 🧾 Orders persisted locally with a simple checkout flow  
- 🪟 Product modal using React Portal  
- 🎯 Context API for state management  
- 📱 Responsive and clean UI layout  

---

## 🛠 Tech Stack
- **Frontend:** React 18  
- **Build Tool:** Vite  
- **Routing:** `react-router-dom` (v6)  
- **UI Helpers:** `react-slick` + `slick-carousel` (hero/featured sliders)  
- **State Management:** React Context API + `localStorage`  
- **Styling:** CSS  
- **Package Manager:** npm  

---

## 📦 Prerequisites
- Node.js (v16+ recommended)  
- npm  

Check versions:
```bash
node -v
npm -v
```

---

## ▶️ Quick Start (Windows / PowerShell)

1. Install dependencies:
```powershell
npm install
```

2. Start the dev server:
```powershell
npm run dev
```

3. Build for production:
```powershell
npm run build
```

Open the URL printed by Vite (typically `http://localhost:5173`).  
Live demo: 👉 [https://farm2doorapp.netlify.app/](https://farm2doorapp.netlify.app/)

---

## 📁 Project Structure
```
Farm2Door/
├── public/
│   └── assets/          # Static images (served by path like /assets/...)
├── src/
│   ├── assets/          # Source images (must be imported)
│   ├── components/      # UI components (Header, ProductCard, ProductModal, ProductForm, SearchBar, etc.)
│   ├── context/         # React Contexts (ProductContext, AuthContext, ToastContext)
│   ├── data/
│   │   └── products.js  # Product catalog data (imports images from src/assets)
│   ├── pages/           # Route pages (Home, ProductDetail, Cart, Account, AdminDashboard, ...)
│   ├── App.jsx          # Root component with routes/providers
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
└── README.md
```

---

## 🔑 Authentication & Default Credentials
- A default **admin user** is created automatically on first run if no users exist.  
- Default admin credentials:  
  - **Email:** `admin@farm2door.local`  
  - **Password:** `admin`  
- Stored in `localStorage` by `AuthContext`.

---

## 🗄 State & Persistence
- **ProductContext** manages: `products`, `filtered`, `cart`, `wishlist`, `orders`, `searchTerm`.  
- **AuthContext** manages: `users` and current `user`.  
- **LocalStorage Keys:**  
  - `farm2door_products`  
  - `farm2door_cart`  
  - `farm2door_wishlist`  
  - `farm2door_orders`  
  - `farm2door_users`  
  - `farm2door_user`  

---

## 🖼 Image Handling
- ✅ **Recommended:** Import images from `src/assets` in `src/data/products.js` so Vite bundles them:
  ```js
  import gift1 from '../assets/Gift/gift1.jpg';
  ```
- ⚠️ **Alternative:** Place images in `public/assets/` and reference with absolute paths:
  ```js
  image: '/assets/gift1.jpg'
  ```
- Components include runtime fallbacks (`onError`) to show a placeholder if images fail to load.

---

## 📌 Usage Notes & Behaviors
- Cart operations respect `products[].stock`.  
- `addToCart`, `updateCartQty`, and `removeFromCart` update stock in `ProductContext`.  
- Unauthenticated actions (cart/wishlist) redirect to `/login` with an **intent** so the action completes after login.  
- `ToastProvider` exposes `showToast(message, type)` for lightweight global notifications.  

---

## 🧪 Development Tips
- Use **React DevTools** to inspect `ProductContext` and `AuthContext`.  
- Clear relevant `localStorage` keys while testing to reset state:
  ```js
  localStorage.removeItem('farm2door_products');
  ```

---

## 🤝 Contributing
- Fork → feature branch → pull request.  
- Keep changes small and focused.  
- Update `DEVELOPER_DOCUMENTATION.md` when making API or data‑shape changes (especially `localStorage` schema).  

---

## 📚 Documentation
- Developer guide: [`DEVELOPER_DOCUMENTATION.md`](./DEVELOPER_DOCUMENTATION.md) — contains architecture, component responsibilities, and data flow details.  

---

## 📈 Future Improvements
- Centralized modal manager  
- Product filtering & search  
- Cart persistence  
- Unit & integration tests  
- Backend integration  

---

## 📄 License
This project is a demo / learning project and currently has **no license specified**.  
Add one if you plan to publish or share publicly.

---

## 👤 Author
**Nitish Kumar**  
GitHub: [https://github.com/NitishKumar1123](https://github.com/NitishKumar1123)

---
