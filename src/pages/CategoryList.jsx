import React, { useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import CategorySection from '../components/CategorySection';

export default function CategoryList() {
  const { category } = useParams();
  const { products, setSearchTerm } = useContext(ProductContext);

  useEffect(() => {
    // reset global search when viewing a category page
    setSearchTerm('');
  }, [category]);

  const categories = ['Gift', 'Beauty', 'Electronics', 'Fruits'];

  if (!category) {
    // show category tiles
    return (
      <div className="page-container">
        <h2>Categories</h2>
        <div className="category-tiles">
          {categories.map((c) => (
            <Link key={c} to={`/category/${c}`} className="category-tile" onClick={() => setSearchTerm('')}>
              <div className="category-tile-body">
                <div className="category-tile-title">{c}</div>
                <div className="category-tile-meta">{products.filter((p) => p.category.toLowerCase() === c.toLowerCase()).length} products</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const list = products.filter((p) => p.category.toLowerCase() === (category || '').toLowerCase());

  // Render CategorySection with a strict 5-item limit per requirements
  return (
    <div className="page-container">
      <CategorySection title={category} products={list} limit={5} />
    </div>
  );
}
