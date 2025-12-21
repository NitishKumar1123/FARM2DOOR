
// src/App.jsx
import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { AuthProvider, AuthContext } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { ToastProvider } from './context/ToastContext'

import Header from './components/Header'
import BottomNav from './components/BottomNav'

import Home from './pages/Home'
import CategoryList from './pages/CategoryList'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import ProductDetail from './pages/ProductDetail'

// Route guard: requires login
function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(AuthContext)
  const location = useLocation()

  if (!isLoggedIn) {
    // Redirect to login and remember where user was going
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>{/* ⬅️ wrap the whole app so toasts work everywhere */}
            <div className="app-root">
              <Header />
              <main className="app-main">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:category" element={<CategoryList />} />
                  <Route path="/category" element={<CategoryList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* Protected routes */}
                  <Route
                    path="/wishlist"
                    element={
                      <RequireAuth>
                        <Wishlist />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <RequireAuth>
                        <Account />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <RequireAuth>
                        <Cart />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <RequireAuth>
                        <OrderHistory />
                      </RequireAuth>
                    }
                  />
                </Routes>
              </main>

              {/* Drawer mounted once */}
              <Profile />
              <BottomNav />
            </div>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
