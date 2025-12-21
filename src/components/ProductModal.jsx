import React, { useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ProductContext } from '../context/ProductContext'
import { AuthContext } from '../context/AuthContext'
// no global toast here — use inline popups inside modal for product-scoped messages
import InlineToast from './InlineToast'

export default function ProductModal({ product, onClose }) {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useContext(ProductContext)
  const { isLoggedIn } = useContext(AuthContext)
  // modal uses inline messages; avoid global toasts for product-scoped feedback
  const [inline, setInline] = React.useState({ open: false, message: '', type: 'info' })

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!product) return null

  const saved = wishlist.some((w) => w.id === product.id)

  const modalContent = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* inline toast inside modal */}
        <InlineToast open={inline.open} message={inline.message} type={inline.type} onClose={() => setInline({ open: false, message: '', type: 'info' })} />
        
        {/* Product Image */}
        <div className="modal-media">
          <img
            src={product.image}
            alt={product.title || product.name}
            className="modal-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/vite.svg'
            }}
          />
        </div>

        {/* Product Details */}
        <div className="modal-body">
          <h3 className="modal-title">{product.title || product.name}</h3>
          <div className="modal-category">{product.category}</div>
          <div className="modal-desc">{product.description}</div>

          {/* Actions */}
          <div className="modal-actions">
            <strong className="modal-price">${product.price}</strong>
            <div className="modal-cta">
              <button
                className="btn-primary"
                onClick={() => {
                  if (!isLoggedIn) {
                    setInline({ open: true, message: 'Please login to add to cart', type: 'warn' })
                    return
                  }
                  addToCart(product)
                  setInline({ open: true, message: 'Added to cart', type: 'success' })
                  onClose()
                }}
                disabled={!isLoggedIn}
              >
                Add to Cart
              </button>

              <button
                className="btn-link"
                onClick={() => {
                  if (!isLoggedIn) {
                    setInline({ open: true, message: 'Please login to save wishlist', type: 'warn' })
                    return
                  }
                  if (saved) {
                    removeFromWishlist(product.id)
                    setInline({ open: true, message: 'Removed from wishlist', type: 'info' })
                  } else {
                    addToWishlist(product)
                    setInline({ open: true, message: 'Saved to wishlist', type: 'success' })
                  }
                }}
              >
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div style={{ marginTop: 12 }}>
            <button className="btn-link" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}

