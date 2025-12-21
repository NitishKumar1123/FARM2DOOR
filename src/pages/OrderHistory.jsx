import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const { orders } = useContext(ProductContext);
  const { isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <h3>Please login to view orders</h3>
        <button onClick={() => nav('/login')}>Go to Login</button>
      </div>
    );
  }

  if (!orders || orders.length === 0) return (<div className="page-container"><h3>No orders yet</h3></div>);

  return (
    <div className="page-container">
      <h2>Order History</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map((o) => (
          <div key={o.id} className="admin-card">
            <div><strong>Order:</strong> {o.id}</div>
            <div style={{ color: 'var(--muted)' }}>Date: {new Date(o.date).toLocaleString()}</div>
            <div style={{ marginTop: 8 }}>
              {o.items.map((it) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>{it.title} x{it.qty}</div>
                  <div>${(it.price * it.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, textAlign: 'right' }}><strong>Total: ${o.total.toFixed(2)}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}
