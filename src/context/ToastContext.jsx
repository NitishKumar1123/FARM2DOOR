
// src/context/ToastContext.jsx  (or src/components/ToastContext.jsx)
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // ✅ showToast: triggers a toast and auto-dismisses after `duration`
  const showToast = useCallback((message, type = 'info', duration = 2200) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ✅ Container rendered at root so it overlays pages */}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...typeStyle[t.type] }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

/* ===== Inline styles (move to CSS if you prefer) ===== */
const containerStyle = {
  position: 'fixed',
  top: 16,
  right: 16,
  display: 'grid',
  gap: 8,
  zIndex: 1000,          // ensure it sits above everything
  pointerEvents: 'none', // avoid blocking clicks on page
}

const toastStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  color: '#fff',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  fontSize: 14,
  maxWidth: 320,
}

const typeStyle = {
  info: { background: '#2563eb' },
  success: { background: '#16a34a' },
  warn: { background: '#d97706' },
  error: { background: '#dc2626' },
}