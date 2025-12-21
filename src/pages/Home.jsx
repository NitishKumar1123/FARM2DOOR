
import React, { useContext, useEffect, useMemo } from 'react'
import Slider from 'react-slick'
import { useNavigate, useLocation } from 'react-router-dom'

import { AuthContext } from '../context/AuthContext'
import { ProductContext } from '../context/ProductContext'
import { useToast } from '../context/ToastContext'

import CategorySection from '../components/CategorySection'
import ProductCard from '../components/ProductCard'

// slick styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// banner images
import banner1 from '../assets/Banner/banner1.jpg'
import banner2 from '../assets/Banner/banner2.jpg'
import banner4 from '../assets/Banner/banner4.jpg'
import banner5 from '../assets/Banner/banner5.jpg'

export default function Home() {
  const { filtered, setSearchTerm, addToCart, addToWishlist } = useContext(ProductContext)
  const { isLoggedIn } = useContext(AuthContext)
  const { showToast } = useToast()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setSearchTerm('')
  }, [setSearchTerm])

  const categories = ['Gift', 'Beauty', 'Electronics', 'Fruits']
  const heroBanners = useMemo(() => [banner1, banner2, banner4, banner5], [])

  /* HERO BANNER SETTINGS (slide) */
  const heroSettings = {
    dots: true,
    infinite: true,
    // turn off fade to enable sliding
    fade: false,
    speed: 600,               // slide transition speed
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,             // show arrows for manual slide
    pauseOnHover: true,
    draggable: true,          // mouse drag
    swipe: true,              // touch swipe
    swipeToSlide: true,
    cssEase: 'ease',          // easing for slide animation
    dotsClass: 'slick-dots hero-dots',
  }

  /* FEATURED SLIDER SETTINGS */
  const featuredSettings = {
    dots: false,
    infinite: true,
    speed: 450,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    lazyLoad: 'ondemand',
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  }

  // Add to cart from Home: redirect to login if needed, otherwise add and toast
  const handleAddFromHome = (product) => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: location,
          intent: { type: 'ADD_TO_CART', product }, // carry intent so we can add after login
        },
      })
      return
    }
    addToCart(product)
    showToast('Item added to cart', 'success')
  }

  // Add to wishlist from Home
  const handleWishlistFromHome = (product) => {
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: location,
          intent: { type: 'TOGGLE_WISHLIST', product },
        },
      })
      return
    }
    addToWishlist(product)
    showToast('Item added to wishlist', 'success')
  }

  return (
    <div className="page-container">
      {/* //HERO BANNER    */}
      <div className="hero-banner">
        <Slider {...heroSettings}>
          {heroBanners.map((img, idx) => (
            <div key={idx} className="hero-slide">
              <img src={img} alt={`banner-${idx}`} loading="lazy" />
              <div className="hero-overlay" />
            </div>
          ))}
        </Slider>
      </div>

      {/* CATEGORY SECTIONS */}
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          title={cat}
          products={filtered.filter(
            (p) => {
              // Handle both single category string and array of categories
              const productCategories = Array.isArray(p.category) ? p.category : [p.category];
              return productCategories.some(pc => (pc || '').toLowerCase() === cat.toLowerCase());
            }
          )}
          limit={6}
          // If your CategorySection renders ProductCard internally and supports passing handlers,
          // you can thread these through (CategorySection -> ProductCard). Otherwise, ProductCard's
          // own logic can handle login redirect + toasts.
          onAdd={handleAddFromHome}
          onWishlist={handleWishlistFromHome}
        />
      ))}

      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>

        <Slider {...featuredSettings}>
          {filtered.slice(0, 15).map((product) => (
            <div key={product.id} className="featured-slide">
              <ProductCard
                product={product}
                useDialog={false}
                // Pass handlers in case your ProductCard accepts them.
                // If ProductCard doesn't, you can remove these props and rely on ProductCard's internal logic.
                onAdd={handleAddFromHome}
                onWishlist={handleWishlistFromHome}
              />
            </div>
          ))}
        </Slider>
      </section>
    </div>
  )
}
