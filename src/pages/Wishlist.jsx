import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import InlineToast from '../components/InlineToast'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(ProductContext);
  const { isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();
  const { showToast } = useToast();
  const [inline, setInline] = React.useState({ open: false, message: '', type: 'info', id: null })

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Please login to view your wishlist</h3>
        <button onClick={() => nav('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.length === 0 && <div>No items saved.</div>}
        {wishlist.map((p) => (
          <div key={p.id} className="wish-card">
            <div className="wish-title">{p.title}</div>
            <div className="wish-price">${p.price}</div>
            <div>
              <button className="btn-link" onClick={() => { removeFromWishlist(p.id); setInline({ open: true, message: 'Removed from wishlist', type: 'info', id: p.id }); }}>
                Remove
              </button>
              {inline.open && inline.id === p.id && (
                <InlineToast open={inline.open} message={inline.message} type={inline.type} onClose={() => setInline({ open: false, message: '', type: 'info', id: null })} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
