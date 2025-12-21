import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import logoImg from '../assets/Banner/Media.png'
import cartImg from '../assets/Banner/shopping-cart.png'

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(ProductContext);
  const { setSearchTerm } = useContext(ProductContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="site-logo">
        <Link to="/" className="logo-link" onClick={() => setSearchTerm('')} aria-label="Farm2Door home">
          <img src={logoImg} alt="Farm2Door" className="logo-img" />
          <span className="logo-text">Farm2door</span>
        </Link>
      </div>

      <SearchBar />

      <div className="header-actions">
        <button onClick={() => navigate('/cart')} className="cart-btn" aria-label="View cart">
          <img src={cartImg} alt="Cart" className="cart-icon" />
          {cart.length > 0 && <span className="cart-count">{cart.reduce((s, i) => s + i.qty, 0)}</span>}
        </button>

        {!user ? (
          <Link to="/login" className="nav-login">Login</Link>
        ) : (
          <div className="profile-wrap">
            <button onClick={() => setOpen((s) => !s)} className="profile-btn">
              {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: 20, objectFit: 'cover', marginRight: 8 }} /> : <span style={{ marginRight: 8 }}>👤</span>}
              {user.name || user.email}
            </button>
            {open && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={() => { setSearchTerm(''); window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'profile' } })); setOpen(false); }}>Profile</button>
                <button className="dropdown-item" onClick={() => { setSearchTerm(''); window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'personal' } })); setOpen(false); }}>Personal Info</button>
                <button className="dropdown-item" onClick={() => { setSearchTerm(''); window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'addresses' } })); setOpen(false); }}>Saved Address</button>
                <Link to="/orders" className="dropdown-item" onClick={() => setSearchTerm('')}>Orders</Link>
                {user.role === 'admin' && <Link to="/admin" className="dropdown-item" onClick={() => setSearchTerm('')}>Admin Dashboard</Link>}
                <button onClick={handleLogout} className="dropdown-item">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

