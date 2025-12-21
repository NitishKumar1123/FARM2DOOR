import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { setSearchTerm } = useContext(ProductContext);

  function active(path) {
    return pathname === path ? { background: '#f5f5f5', borderRadius: 18 } : { background: 'transparent' };
  }

  return (
    <nav className="bottom-nav">
      <button className={`nav-btn ${pathname === '/' ? 'active' : ''}`} onClick={() => { setSearchTerm(''); nav('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
      <button className={`nav-btn ${pathname.startsWith('/category') ? 'active' : ''}`} onClick={() => { setSearchTerm(''); nav('/category'); }}>Category</button>
      <button className={`nav-btn ${pathname === '/wishlist' ? 'active' : ''}`} onClick={() => { setSearchTerm(''); nav('/wishlist'); }}>Wishlist</button>
      <button className={`nav-btn ${pathname === '/cart' ? 'active' : ''}`} onClick={() => { setSearchTerm(''); nav('/cart'); }}>Checkout</button>
    </nav>
  );
}
