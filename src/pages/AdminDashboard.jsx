import React, { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';
import ProductForm from './ProductForm';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard() {
  const { products, adminAddProduct, adminEditProduct, adminDeleteProduct, resetCatalog, orders } = useContext(ProductContext);
  const { isAdmin, getAllUsers, adminDeleteUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState('products'); // 'products' | 'users'
  const [confirm, setConfirm] = useState({ open: false });

  if (!isAdmin) return <div className="page-container">Access denied. Admins only.</div>;

  const users = getAllUsers();

  function confirmAction(opts) {
    setConfirm({ open: true, ...opts });
  }

  return (
    <div className="page-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-controls">
        <div className="admin-controls-left">
          <button onClick={() => setEditing({})}>Add Product</button>
          <button onClick={() => setView('products')}>Products</button>
          <button onClick={() => setView('users')}>Users / Orders</button>
        </div>
        <div className="admin-controls-right">
          <button onClick={() => confirmAction({ title: 'Reset catalog', message: 'Restore sample products? This will replace the catalog with the original sample products.', onConfirm: () => { resetCatalog(); setConfirm({ open: false }); } })}>Reset Catalog</button>
        </div>
      </div>

      {editing && <ProductForm initial={editing} onCancel={() => setEditing(null)} onSave={(formData) => { 
        // Convert FormData to plain object
        const productData = {
          title: formData.get('title'),
          price: Number(formData.get('price')),
          description: formData.get('description'),
          category: formData.getAll('category[]'), // gets all category values
          image: editing.image || '', // keep existing image if not changed
          stock: editing.stock || 10, // default stock for new products
        };
        
        // If editing (has id), add it
        if (editing.id) {
          productData.id = editing.id;
          adminEditProduct(productData);
        } else {
          adminAddProduct(productData);
        }
        setEditing(null); 
      }} />}

      {view === 'products' && (
        <div className="admin-grid">
          {products.map((p) => (
            <div key={p.id} className="admin-card">
              <div className="admin-title">{p.title}</div>
              <div className="admin-meta">{p.category} • ${p.price}</div>
              <div className="admin-actions">
                <button onClick={() => setEditing(p)}>Edit</button>
                <button className="btn-spaced" onClick={() => confirmAction({ title: 'Delete product', message: `Delete \"${p.title}\"?`, onConfirm: () => { adminDeleteProduct(p.id); setConfirm({ open: false }); } })}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'users' && (
        <div className="admin-users-column">
          <h3>Users</h3>
          <div className="admin-grid">
            {users.map((u) => (
              <div key={u.id} className="admin-card">
                <div className="admin-title">{u.name || u.email}</div>
                <div className="admin-meta">{u.email} • {u.role}</div>
                <div className="admin-actions">
                  <button onClick={() => confirmAction({ title: 'Delete user', message: `Delete user ${u.email}?`, onConfirm: () => { adminDeleteUser(u.id); setConfirm({ open: false }); } })}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="admin-orders-title">Orders</h3>
          <div className="admin-grid">
            {orders.map((o) => (
              <div key={o.id} className="admin-card">
                <div className="admin-title">Order {o.id}</div>
                <div className="admin-meta">User: {o.user?.email || 'guest'} • {new Date(o.date).toLocaleString()}</div>
                <div className="admin-order-meta">
                  <div className="admin-order-items">{o.items?.length || 0} items • ${o.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => { if (confirm.onConfirm) confirm.onConfirm(); else setConfirm({ open: false }); }}
      />
    </div>
  );
}
