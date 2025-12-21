import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ProductContext } from '../context/ProductContext'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import InlineToast from '../components/InlineToast'

export default function ProductDetail() {
  const { id } = useParams()
  const { filtered, addToCart, wishlist, addToWishlist, removeFromWishlist } =
    useContext(ProductContext)
  const { isLoggedIn } = useContext(AuthContext)
  const { showToast } = useToast()
  const [inline, setInline] = React.useState({ open: false, message: '', type: 'info' })

  const product = filtered.find((p) => String(p.id) === id)
  if (!product) return <div className="page-container">Product not found</div>

  const saved = wishlist.find((w) => w.id === product.id)

  return (
    <div className="product-detail-container">
      {/* LEFT: IMAGE */}
      <div className="product-detail-media">
        <img
          src={product.image}
          alt={product.title}
          className="product-detail-img"
        />
      </div>

      {/* RIGHT: DETAILS */}
      <div className="product-detail-info">
        <h1 className="product-detail-title">{product.title}</h1>

        <p className="product-detail-category">{product.category}</p>

        <strong className="product-detail-price">
          ${product.price}
        </strong>

        <div className="product-detail-stock" style={{ marginTop: '12px', fontSize: '16px', fontWeight: 600, color: product.stock > 0 ? '#059669' : '#dc2626' }}>
          {product.stock > 0 ? `Stock Available: ${product.stock}` : 'Out of Stock'}
        </div>

        <p className="product-detail-desc">
          {product.description}
        </p>

        <div className="product-detail-actions">
          <button
            className="btn-primary"
            onClick={() => {
              if (!isLoggedIn) {
                setInline({ open: true, message: 'Please login to add to cart', type: 'warn' })
                return
              }
              if (product.stock <= 0) {
                setInline({ open: true, message: 'Product out of stock', type: 'error' })
                return
              }
              addToCart(product)
              setInline({ open: true, message: 'Added to cart', type: 'success' })
            }}
            disabled={!isLoggedIn || product.stock <= 0}
          >
            Add to Cart
          </button>

          <button
            className="btn-link"
            onClick={() => {
              if (!isLoggedIn) {
                // show inline message near product
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
      {inline.open && <InlineToast open={inline.open} message={inline.message} type={inline.type} onClose={() => setInline({ open: false, message: '', type: 'info' })} />}
    </div>
  )
}
