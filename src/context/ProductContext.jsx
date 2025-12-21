import React, { createContext, useEffect, useState } from 'react';
import sampleProducts from '../data/products';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  function dedupeById(arr) {
    const seen = new Map();
    for (const item of arr) {
      if (!seen.has(item.id)) seen.set(item.id, item);
    }
    return Array.from(seen.values());
  }

  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem('farm2door_products');
      let initial = raw ? JSON.parse(raw) : sampleProducts;
      
      // Merge with sampleProducts to ensure all products have correct stock
      const sampleMap = new Map(sampleProducts.map((p) => [p.id, p]));
      initial = initial.map((p) => {
        const sample = sampleMap.get(p.id);
        // If product exists in sample, merge it (preserves cart changes but resets stock if missing)
        if (sample) {
          return { ...p, stock: p.stock !== undefined ? p.stock : sample.stock };
        }
        return p;
      });
      
      return dedupeById(initial);
    } catch {
      return dedupeById(sampleProducts);
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('farm2door_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('farm2door_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem('farm2door_orders');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  // On mount, ensure any missing sample products are added (handles cases
  // where localStorage was previously trimmed). We merge only missing items
  // by id so admin edits in localStorage are preserved.
  useEffect(() => {
    try {
      const currentIds = new Set(products.map((p) => p.id));
      const missing = sampleProducts.filter((p) => !currentIds.has(p.id));
      if (missing.length) {
        setProducts((prev) => {
          // Prepend missing sample products so they appear in the catalog
          // but keep existing (possibly admin-edited) products intact.
          const merged = [...missing, ...prev];
          // ensure uniqueness by id after merge
          return dedupeById(merged);
        });
      }
    } catch (err) {
      // silent
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure product image fields point to the sampleProducts' image URLs
  // This handles cases where localStorage contains older entries with
  // absolute '/assets/..' strings that may not resolve when images are
  // imported by Vite. We preserve other admin edits but normalize images
  // so the UI always shows the bundled images for known sample ids.
  // Also sync stock values from sampleProducts to ensure all products start with correct stock.
  useEffect(() => {
    try {
      const sampleMap = new Map(sampleProducts.map((p) => [p.id, p]));
      setProducts((prev) => {
        let changed = false;
        const next = prev.map((p) => {
          const sample = sampleMap.get(p.id);
          if (sample) {
            let updated = { ...p };
            if (p.image !== sample.image) {
              changed = true;
              updated.image = sample.image;
            }
            // Sync stock from sample products
            if (p.stock === undefined || p.stock < 0) {
              changed = true;
              updated.stock = sample.stock;
            }
            return updated;
          }
          return p;
        });
        return changed ? next : prev;
      });
    } catch (err) {
      // ignore
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('farm2door_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('farm2door_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('farm2door_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('farm2door_orders', JSON.stringify(orders));
  }, [orders]);

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      // Get current stock from products state
      const currentProduct = products.find((p) => p.id === product.id);
      const availableStock = currentProduct?.stock || 0;
      
      // Prevent adding if no stock available
      if (availableStock <= 0) {
        return prev;
      }
      
      // Don't add more than available stock
      const qtyToAdd = Math.min(qty, availableStock);
      
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        // Update quantities and reduce stock by the difference
        const newQty = found.qty + qtyToAdd;
        const qtyDifference = newQty - found.qty;
        // Reduce stock for the added quantity
        setProducts((prodsPrev) =>
          prodsPrev.map((p) =>
            p.id === product.id
              ? { ...p, stock: Math.max(0, p.stock - qtyDifference) }
              : p
          )
        );
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: newQty } : p
        );
      } else {
        // New item: reduce stock by qty
        setProducts((prodsPrev) =>
          prodsPrev.map((p) =>
            p.id === product.id
              ? { ...p, stock: Math.max(0, p.stock - qtyToAdd) }
              : p
          )
        );
        return [...prev, { ...product, qty: qtyToAdd }];
      }
    });
  }

  function updateCartQty(id, qty) {
    setCart((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;
      
      const oldQty = item.qty;
      const newQty = Math.max(1, qty);
      const qtyDifference = newQty - oldQty;
      
      // Adjust stock based on quantity change
      setProducts((prodsPrev) =>
        prodsPrev.map((p) =>
          p.id === id
            ? { ...p, stock: Math.max(0, p.stock - qtyDifference) }
            : p
        )
      );
      
      return prev.map((p) =>
        p.id === id ? { ...p, qty: newQty } : p
      );
    });
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        // Restore stock when item is removed
        setProducts((prodsPrev) =>
          prodsPrev.map((p) =>
            p.id === id
              ? { ...p, stock: p.stock + item.qty }
              : p
          )
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function addToWishlist(product) {
    setWishlist((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }

  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  }

  function adminAddProduct(newProduct) {
    setProducts((prev) => [{ ...newProduct, id: `p${Date.now()}` }, ...prev]);
  }

  function adminEditProduct(updated) {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p));
  }

  function adminDeleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // also remove from cart/wishlist if present
    setCart((prev) => prev.filter((c) => c.id !== id));
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  }

  function resetCatalog() {
    // Replace products with the original sampleProducts.
    // This is intended for demo/admin to restore defaults.
    setProducts(sampleProducts);
  }

  function createOrder({ items, total, user }) {
    const order = {
      id: `o${Date.now()}`,
      items,
      total,
      user: user || null,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    // clear cart after order
    setCart([]);
    return order;
  }

  const filtered = products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const value = {
    products,
    filtered,
    cart,
    wishlist,
    orders,
    searchTerm,
    setSearchTerm,
    addToCart,
    updateCartQty,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    adminAddProduct,
    adminEditProduct,
    adminDeleteProduct,
    resetCatalog,
    createOrder,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export default ProductProvider;
