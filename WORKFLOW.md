# Farm2Door — Workflow & Architecture

This document explains the high-level architecture, data flow, and UI/UX behavior to help new developers onboard quickly.

## Architecture overview

- React functional components with Context for app-wide state.
- Bundler: Vite (fast dev server and ES module handling).
- State is stored in `ProductContext` and persisted to `localStorage` for demo purposes.

Files of interest

- `src/context/ProductContext.jsx` — central source of truth for products, cart, wishlist, and orders. It initializes from `src/data/products.js` (or from localStorage if present) and provides functions such as `addToCart`, `updateCartQty`, `createOrder`, and admin helpers.
- `src/data/products.js` — sample product entries used to seed the app. Images referenced here should either be imported (module import) or placed in `public/assets/` for absolute paths.
- `src/components/ProductCard.jsx` — displays a product tile, image, and actions (add, wishlist). Clicking the product opens `ProductModal`.
- `src/pages/Cart.jsx` — displays items in cart and controls to update quantity or checkout.

Data flow

1. `products.js` provides the initial product list used by `ProductContext`.
2. When the app initializes, `ProductContext` loads from `localStorage` (if present). It merges missing sample products on first mount.
3. User interactions (add to cart, wishlist) call context functions which update React state and persist to `localStorage` via effects.
4. Checkout creates an `order` record in `orders` and clears the cart.

UI/UX behavior notes

- Product images: Components expect `product.image` to be either:
  - a string URL (absolute path like `/assets/..` pointing to `public/`), or
  - an imported module value (when image files live in `src/assets` and are imported into `products.js`).

- Error handling: Components include `onError` fallbacks to avoid broken images causing layout reflow; missing images show a placeholder (`/vite.svg`).

- Modal behavior: `ProductModal` renders a backdrop with `position: fixed` and high `z-index` so it overlays the page. Ensure only one modal is mounted for a smooth UX.

- Cart layout: Cart items are displayed as a column list. Each item is a flex row with image, info, qty controls, and total. The CSS transition is subtle; avoid toggling display: none/block on parent containers rapidly to prevent flicker.

Common developer tasks

- Adding images:
  - Preferred: add file to `src/assets/...` and import it in `src/data/products.js`:

    ```js
    import myImg from '../assets/Gift/my.jpg'
    // ... then set image: myImg
    ```

  - Alternative: place file in `public/assets/` and reference by absolute path `/assets/my.jpg`.

- Adding products: update `src/data/products.js` and provide `id`, `title`, `price`, `category`, `image`, and `description`.

- Admin edits: `ProductContext` includes `adminAddProduct`, `adminEditProduct`, and `adminDeleteProduct` helpers that persist to `localStorage`.

Debugging tips

- Images not loading: check Network tab in DevTools. If requested path is `/assets/...` but file is not in `public/assets/`, either add it there or import in `products.js`.
- Overlapping/flicker UI: check for conflicting global CSS rules (particularly body/root overrides) and duplicated CSS files. Inspect element to see if an element is centered with `display:flex` unexpectedly.
- Modal flicker: ensure that `ProductModal` uses a single `open` state and that unmounting/mounting is not triggered by parent re-renders unnecessarily.

Notes on testing

- Run `npm run dev` and manually test:
  - Add items to cart and open the `Cart` page.
  - Click product to open modal and ensure only one modal is shown.
  - Inspect images for any broken links.

If you have CI or want automated checks, consider adding basic unit tests for `ProductContext` operations and simple visual regression tests for components.
