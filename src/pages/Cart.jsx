// src/pages/Cart.jsx
import React, { useContext, useEffect } from 'react'
import { ProductContext } from '../context/ProductContext'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate, useLocation } from 'react-router-dom'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, createOrder } = useContext(ProductContext)
  const { isLoggedIn, user } = useContext(AuthContext)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } })
    }
  }, [isLoggedIn, navigate, location])

  if (!isLoggedIn) return null

  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.qty) || 1
    return sum + price * qty
  }, 0)

  if (!cart || cart.length === 0) {
    return (
      <div className="page-container cart-page">
        <h2>Cart</h2>
        <div className="empty-state" style={{ padding: '16px 0', color: 'var(--muted)' }}>
          Your cart is empty
          <div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/')}
            >
              Add more products
            </button>
          </div>
        </div>
      </div>
    )
  }

  function handleCheckout() {
    if (!cart || cart.length === 0) {
      showToast('Cart is empty', 'info')
      return
    }

    createOrder({
      items: cart.map(({ id, title, price, qty, image }) => ({
        id,
        title,
        price: Number(price) || 0,
        qty: Number(qty) || 1,
        image,
      })),
      total: subtotal,
      user: user?.username ?? null,
    })

    showToast(`Order placed for ${cart.length} item(s)`, 'success')
    navigate('/orders')
  }

  return (
    <div className="page-container cart-page">
      <h2>Cart</h2>

      <div className="cart-list">
        {cart.map((c) => {
          const price = Number(c.price) || 0
          const qty = Number(c.qty) || 1
          const lineTotal = (price * qty).toFixed(2)

          return (
            <div key={c.id} className="cart-item" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border, #e5e7eb)' }}>
              <img
                src={c.image}
                alt={c.title}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 8,
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/vite.svg'
                }}
              />

              <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="cart-item-title" style={{ fontWeight: 600 }}>{c.title}</div>
                <div className="cart-item-price" style={{ color: 'var(--muted)' }}>${price.toFixed(2)}</div>

                <div className="qty-controls" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextQty = qty - 1
                      if (nextQty <= 0) {
                        removeFromCart(c.id)
                        showToast('Item removed from cart', 'info')
                      } else {
                        updateCartQty(c.id, nextQty)
                        showToast(`Quantity updated to ${nextQty}`, 'success')
                      }
                    }}
                  >
                    -
                  </button>

                  <span className="qty">{qty}</span>

                  <button
                    type="button"
                    onClick={() => {
                      updateCartQty(c.id, qty + 1)
                      showToast(`Quantity updated to ${qty + 1}`, 'success')
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="line-total" style={{ fontWeight: 600, marginTop: 6 }}>
                  ${lineTotal}
                </div>

                <button
                  type="button"
                  className="btn-danger"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    removeFromCart(c.id)
                    showToast('Item removed from cart and stock restored', 'info')
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="cart-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <div className="subtotal" style={{ fontWeight: 700 }}>
          Subtotal: ${subtotal.toFixed(2)}
        </div>
        <div className="cart-actions">
          <button type="button" className="btn-outline" onClick={() => navigate('/')}>
            Add more products
          </button>
          <button type="button" className="btn-primary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
            