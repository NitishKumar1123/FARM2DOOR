import React, { useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '../context/toastcontext';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import AddressForm from '../components/AddressForm';

export default function Profile() {
  const { user, updateProfile, addAddress, editAddress, removeAddress } = useContext(AuthContext);
  const [view, setView] = useState('profile'); // 'profile' | 'personal' | 'addresses'
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [addressModal, setAddressModal] = useState({ open: false, initial: null });
  const [confirm, setConfirm] = useState({ open: false });
  const fileRef = useRef(null);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAvatarPreview(user?.avatar || null);
  }, [user]);

  // Listen for global open events so other components can open the drawer
  useEffect(() => {
    function handleOpen(e) {
      const v = e?.detail?.view || 'profile';
      setView(v);
      setDrawerOpen(true);
    }
    window.addEventListener('farm2door:openProfile', handleOpen);
    return () => window.removeEventListener('farm2door:openProfile', handleOpen);
  }, []);

  // When drawer opens, trap focus to the drawer and prevent background scroll.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }

    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
      // focus first tab button inside drawer
      setTimeout(() => {
        try {
          const btn = drawerRef.current?.querySelector('.nav-btn');
          if (btn) btn.focus();
          else closeBtnRef.current?.focus();
        } catch { }
      }, 50);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  function toBase64(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  async function handleAvatarInput(e) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    try {
      const b64 = await toBase64(file);
      // Update immediately in UI and context
      setAvatarPreview(b64);
      updateProfile({ avatar: b64 });
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error(err);
      const { showToast } = useToast();
      showToast('Failed to read image', 'error')
    }
  }

  // Do not render any UI until the drawer is opened. The component remains mounted
  // so it can listen for `farm2door:openProfile` events.
  if (!drawerOpen) return null;

  function openAdd() {
    setAddressModal({ open: true, initial: { label: '', line: '', city: '', zip: '', country: '' } });
  }

  function openEditAddress(a) {
    setAddressModal({ open: true, initial: { ...a } });
  }

  function handleSaveAddress(addr) {
    // If addr has an id, treat as edit; otherwise add (AuthContext will create id)
    if (addr?.id) editAddress(addr.id, addr);
    else addAddress(addr);
    setAddressModal({ open: false, initial: null });
  }

  function confirmDeleteAddress(id) {
    setConfirm({ open: true, title: 'Delete address', message: 'Delete this address?', onConfirm: () => { removeAddress(id); setConfirm({ open: false }); } });
  }

  function savePersonal() {
    // simple validation
    const { showToast } = useToast();
    if (!name || name.trim().length < 2) {
      showToast('Please enter a valid name', 'warn')
      return
    }
    if (phone && !/^[0-9+\- ()]{6,20}$/.test(phone)) {
      showToast('Please enter a valid phone number', 'warn')
      return
    }
    updateProfile({ name: name.trim(), phone: phone.trim() });
    setEditingPersonal(false);
  }
  return(
    <div className="page-container">
      {/* Drawer implementation: backdrop + drawer panel (drawer is opened via app events) */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" role="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ margin: 0 }}>My Profile</h3>
              <div>
                <button className="btn-link" onClick={() => setDrawerOpen(false)}>Close</button>
              </div>
            </div>


            <div className="auth-tabs" role="tablist" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className={`nav-btn ${view === 'profile' ? 'active' : ''}`} onClick={() => setView('profile')}>Profile</button>
              <button className={`nav-btn ${view === 'personal' ? 'active' : ''}`} onClick={() => setView('personal')}>Personal Info</button>
              <button className={`nav-btn ${view === 'addresses' ? 'active' : ''}`} onClick={() => setView('addresses')}>Saved Address</button>
            </div>

            <div className="drawer-body">
              {!user ? (
                <div style={{ padding: 18 }}>
                  <h3>Please login</h3>
                  <p className="muted">You must be logged in to view profile details.</p>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn-primary" onClick={() => { setDrawerOpen(false); window.location.href = '/login'; }}>Go to Login</button>
                  </div>
                </div>
              ) : (
                <>
                  {view === 'profile' && (
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      {avatarPreview ? <img src={avatarPreview} alt="avatar" className="avatar-large" /> : <div className="avatar-large avatar-empty">No avatar</div>}
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
                        <div style={{ marginTop: 8 }}>
                          <button className="btn-primary" onClick={() => fileRef.current && fileRef.current.click()}>Change Avatar</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {view === 'personal' && (
                    <div>
                      {!editingPersonal ? (
                        <div className="profile-info">
                          <div><strong>Name:</strong> {user.name}</div>
                          <div><strong>Email:</strong> {user.email}</div>
                          <div><strong>Phone:</strong> {user.phone}</div>
                          <div className="profile-actions" style={{ marginTop: 12 }}>
                            <button onClick={() => setEditingPersonal(true)} className="btn-primary">Edit</button>
                          </div>
                        </div>
                      ) : (
                        <div className="profile-edit">
                          <label>Full name</label>
                          <input value={name} onChange={(e) => setName(e.target.value)} />
                          <label>Phone</label>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                          <div className="profile-actions">
                            <button onClick={savePersonal} className="btn-primary">Save</button>
                            <button onClick={() => { setEditingPersonal(false); setName(user?.name || ''); setPhone(user?.phone || ''); }} className="btn-link">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {view === 'addresses' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Saved Addresses</h4>
                        <div>
                          <button className="btn-primary" onClick={openAdd}>Add Address</button>
                        </div>
                      </div>

                      {(user.addresses || []).length === 0 && <div style={{ marginTop: 12 }}>No addresses yet.</div>}

                      {(user.addresses || []).map((a) => (
                        <div key={a.id} className="address-card">
                          <div>
                            <div className="address-label"><strong>{a.label || 'Address'}</strong></div>
                            <div className="address-line">{a.line}</div>
                            <div className="address-line">{a.city} {a.zip} {a.country}</div>
                          </div>
                          <div className="address-actions">
                            <button onClick={() => openEditAddress(a)}>Edit</button>
                            <button onClick={() => confirmDeleteAddress(a.id)} className="btn-link">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* hidden file input for avatar changes inside drawer */}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarInput} />

            <AddressForm open={addressModal.open} initial={addressModal.initial} onSave={handleSaveAddress} onCancel={() => setAddressModal({ open: false, initial: null })} />
            <ConfirmModal open={confirm.open} title={confirm.title} message={confirm.message} onCancel={() => setConfirm({ open: false })} onConfirm={() => { if (confirm.onConfirm) confirm.onConfirm(); else setConfirm({ open: false }); }} />
          </div>
        </div>
      )}
    </div>
  );
}