import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const nav = useNavigate();

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Please login</h3>
        <button onClick={() => nav('/login')}>Go to Login</button>
      </div>
    );
  }
//logged in view
  return (
    <div style={{ padding: 12 }}>
      <h2>Account</h2>
      <div>Username: {user.username}</div>
      <div>Role: {user.role}</div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => { window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'profile' } })); }}>Profile</button>
        <button onClick={() => { window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'personal' } })); }}>Personal Info</button>
        <button onClick={() => { window.dispatchEvent(new CustomEvent('farm2door:openProfile', { detail: { view: 'addresses' } })); }}>Saved Address</button>
        <button onClick={() => { logout(); nav('/'); }}>Logout</button>
      </div>
    </div>
  );
}
