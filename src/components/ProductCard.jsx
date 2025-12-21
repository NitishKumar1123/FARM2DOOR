
// src/components/ProductCard.jsx
import React, { useContext, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ProductContext } from '../context/ProductContext'
import { useToast } from '../context/ToastContext'
import InlineToast from './InlineToast'
import ProductModal from './ProductModal'

export default function ProductCard({
  product,
  full = false,
  useDialog = false,
  onAdd,       // optional: if parent (Home/CategorySection) wants to handle add
  onWishlist,  // optional: if parent wants to handle wishlist
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, isAdmin } = useContext(AuthContext)
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } =
    useContext(ProductContext)

  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const [inline, setInline] = useState({ open: false, message: '', type: 'info' })

  // Safe memoized check
  const saved = useMemo(() => wishlist?.some((w) => w.id === product.id), [wishlist, product.id])

  const handleProductClick = () => {
    if (useDialog) {
      setOpen(true)
    } else {
      navigate(`/product/${product.id}`)
    }
  }

  // Helper: redirect to login with intent
  const redirectToLoginWithIntent = (intent) => {
    navigate('/login', {
      state: {
        from: location,
        intent, // e.g. { type: 'ADD_TO_CART', product } or { type: 'TOGGLE_WISHLIST', product }
      },
      replace: false,
    })
  }

  // --- Actions ---
  const runAddToCart = () => {
    // If parent provided a handler, call it but still show a toast here
    if (typeof onAdd === 'function') {
      onAdd(product)
      // show inline popup near product
      setInline({ open: true, message: 'Added to cart', type: 'success' })
      return
    }

    addToCart(product)
    setInline({ open: true, message: 'Added to cart', type: 'success' })
  }

  const runWishlistAdd = () => {
    // If parent provided a handler, call it and still show a toast here
    if (typeof onWishlist === 'function') {
      onWishlist(product)
      setInline({ open: true, message: 'Saved to wishlist', type: 'success' })
      return
    }

    addToWishlist(product)
    setInline({ open: true, message: 'Saved to wishlist', type: 'success' })
  }

  const runWishlistRemove = () => {
    removeFromWishlist(product.id)
    setInline({ open: true, message: 'Removed from wishlist', type: 'info' })
  }

  return (
    <div
      onClick={handleProductClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`product-card ${hover ? 'hover' : ''} ${full ? 'full' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-media">
        <img
          src={product.image}
          alt={product.title}
          className="product-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/vite.svg'
          }}
        />
      </div>

      <div className="product-body">
        <h4 className="product-title">{product.title}</h4>
        <div className="product-category">{product.category}</div>
        <div className="product-stock" style={{ fontSize: '12px', color: product.stock > 0 ? '#059669' : '#dc2626', marginTop: '4px', fontWeight: 500 }}>
          {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
        </div>
      </div>

      <div className="product-footer">
        <strong className="product-price">${Number(product.price).toFixed(2)}</strong>

        <div>
          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation() // prevent opening product
              if (isAdmin) return // optional: block admin actions

              if (!isLoggedIn) {
                // carry intent so wishlist is added right after login
                redirectToLoginWithIntent({ type: 'TOGGLE_WISHLIST', product })
                return
              }

              if (saved) {
                runWishlistRemove()
              } else {
                runWishlistAdd()
              }
            }}
            className="wish-btn"
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {saved ? '♥' : '♡'}
          </button>

          {/* Add to Cart button */}
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation() // prevent opening product
              if (isAdmin) return // optional: block admin actions

              if (!isLoggedIn) {
                // carry intent so item is added right after login
                redirectToLoginWithIntent({ type: 'ADD_TO_CART', product })
                return
              }

              runAddToCart()
            }}
            aria-label="Add to cart"
            disabled={product.stock <= 0}
          >
            Add
          </button>
        </div>
      </div>

      {useDialog && open && (
        <ProductModal product={product} onClose={() => setOpen(false)} />
      )}
      <InlineToast open={inline.open} message={inline.message} type={inline.type} onClose={() => setInline({ open: false, message: '', type: 'info' })} />
    </div>
  )
}
