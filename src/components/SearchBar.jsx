import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useContext(ProductContext);

  return (
    <div className="search-wrap modern">
      <span className="search-icon" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <input
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products, categories..."
        aria-label="Search products"
      />
      {searchTerm && (
        <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}
