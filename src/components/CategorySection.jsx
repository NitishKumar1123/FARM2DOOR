import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

export default function CategorySection({ title, products, limit }) {
  const { setSearchTerm } = useContext(ProductContext);
  const visible = typeof limit === 'number' ? products.slice(0, limit) : products;

  return (
    <section id={title.toLowerCase()} className="category-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 className="category-title">{title}</h3>
      </div>
      <div className="products-grid">
        {visible.map((p) => <ProductCard key={p.id} product={p} useDialog={false} />)}
      </div>
    </section>
  );
}
