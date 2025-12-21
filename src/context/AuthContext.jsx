import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const USERS_KEY = 'farm2door_users';
const CURRENT_USER_KEY = 'farm2door_user';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // create a default admin user
      const admin = [{ id: 'u_admin', name: 'Admin', email: 'admin@farm2door.local', password: 'admin', role: 'admin', addresses: [], avatar: null, phone: '' }];
      localStorage.setItem(USERS_KEY, JSON.stringify(admin));
      return admin;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => saveUsers(users), [users]);

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }, [user]);

  function findUserByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  }

  function signup({ name, email, password, phone = '', addresses = [], avatar = null }) {
    if (findUserByEmail(email)) {
      return { ok: false, message: 'Email already in use' };
    }
    const newUser = { id: `u${Date.now()}`, name, email, password, role: 'user', addresses, avatar, phone };
    setUsers((prev) => [newUser, ...prev]);
    setUser({ ...newUser, password: undefined });
    return { ok: true };
  }

  function login({ email, password }) {
    const u = findUserByEmail(email);
    if (!u) return { ok: false, message: 'User not found' };
    if (u.password !== password) return { ok: false, message: 'Invalid password' };
    setUser({ ...u, password: undefined });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(updates) {
    if (!user) return { ok: false, message: 'Not logged in' };
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, ...updates } : u));
    setUser((prev) => ({ ...prev, ...updates }));
    return { ok: true };
  }

  function addAddress(address) {
    if (!user) return { ok: false };
    const addr = { id: `a${Date.now()}`, ...address };
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, addresses: [...(u.addresses || []), addr] } : u));
    setUser((prev) => ({ ...prev, addresses: [...(prev.addresses || []), addr] }));
    return { ok: true };
  }

  function editAddress(id, updates) {
    if (!user) return { ok: false };
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, addresses: (u.addresses || []).map((a) => a.id === id ? { ...a, ...updates } : a) } : u));
    setUser((prev) => ({ ...prev, addresses: (prev.addresses || []).map((a) => a.id === id ? { ...a, ...updates } : a) }));
    return { ok: true };
  }

  function removeAddress(id) {
    if (!user) return { ok: false };
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, addresses: (u.addresses || []).filter((a) => a.id !== id) } : u));
    setUser((prev) => ({ ...prev, addresses: (prev.addresses || []).filter((a) => a.id !== id) }));
    return { ok: true };
  }

  function resetPassword(email) {
    const u = findUserByEmail(email);
    if (!u) return { ok: false, message: 'User not found' };
    // In demo, we simulate password reset by setting password to a short generated string.
    const newPw = `pw${Date.now() % 10000}`;
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, password: newPw } : x));
    return { ok: true, newPassword: newPw };
  }

  // Admin helpers
  function getAllUsers() {
    return users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  function adminDeleteUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    // if current user deleted, logout
    if (user?.id === id) setUser(null);
  }

  const value = {
    user,
    users,
    signup,
    login,
    logout,
    updateProfile,
    addAddress,
    editAddress,
    removeAddress,
    resetPassword,
    getAllUsers,
    adminDeleteUser,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
