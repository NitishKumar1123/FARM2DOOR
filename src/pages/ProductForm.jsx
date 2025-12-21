
import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../context/toastcontext'

/**
 * ProductForm
 * - Categories selected via multiple checkboxes (array state)
 * - Local image upload with preview
 * - Submits FormData (includes image file)
 *
 * Props:
 *  - initial?: { id?, title?, price?, category?, image?, description? }
 *      - category can be string or array of strings
 *      - image can be a URL (existing image for edit mode)
 *  - onSave(FormData): function called with FormData payload
 *  - onCancel(): function called when cancel is clicked
 */
export default function ProductForm({ initial = {}, onSave, onCancel }) {
  // Title
  const [title, setTitle] = useState(initial.title || '');

  // Price as string for controlled input; convert to Number on submit
  const [price, setPrice] = useState(
    initial.price !== undefined && initial.price !== null ? String(initial.price) : ''
  );

  // Normalize initial category -> array for multi-check
  const initialCategories = useMemo(() => {
    if (Array.isArray(initial.category)) return initial.category;
    if (typeof initial.category === 'string' && initial.category.trim()) {
      return [initial.category.trim()];
    }
    return []; // default to none selected
  }, [initial.category]);

  const [categories, setCategories] = useState(initialCategories);

  // Image file + preview (supports existing URL for edit mode)
  const [imageFile, setImageFile] = useState(null); // File from input
  const [imageUrl, setImageUrl] = useState(initial.image || ''); // preview URL (existing or object URL)

  // Description
  const [description, setDescription] = useState(initial.description || '');

  // Preview management for selected file
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(initial.image || '');
    }
  }, [imageFile, initial.image]);

  // Category options (can be externalized or fetched)
  const CATEGORY_OPTIONS = ['Gift', 'Beauty', 'Electronics', 'Fruits'];

  // Handlers
  function toggleCategory(cat) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    const { showToast } = useToast()
    if (!title.trim()) {
      showToast('Title is required', 'warn')
      return;
    }
    if (!price || isNaN(Number(price))) {
      showToast('Price must be a valid number', 'warn')
      return;
    }
    if (!categories.length) {
      showToast('Select at least one category', 'warn')
      return;
    }

    // Base payload fields
    const basePayload = {
      ...(initial.id ? { id: initial.id } : {}),
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
    };

    // Build FormData (recommended for uploading the image in same request)
    const formData = new FormData();
    Object.entries(basePayload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append categories (array as repeated fields category[])
    categories.forEach(cat => formData.append('category[]', cat));

    // Image: attach file if new file selected, else keep existing image URL (edit mode)
    if (imageFile) {
      formData.append('image', imageFile); // 'image' field name — adjust if your API expects a different one
    } else if (initial.image) {
      formData.append('imageUrl', initial.image);
    }

    // Pass FormData up
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Title"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          step="0.01"
          aria-label="Price"
        />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 8, alignItems: 'flex-start' }}>
        {/* MULTI-CHECK CATEGORIES */}
        <div aria-label="Categories" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, color: 'black' }}>
          {CATEGORY_OPTIONS.map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* LOCAL FILE UPLOAD */}
        <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Product image file"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              style={{
                width: 72,
                height: 72,
                objectFit: 'cover',
                marginTop: 6,
                borderRadius: 6,
                border: '1px solid #ddd',
              }}
            />
          )}
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        aria-label="Description"
        style={{ width: '100%', marginTop: 8, minHeight: 80 }}
      />

      {/* Optional: show selected categories as chips */}
      {!!categories.length && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <span
              key={cat}
              style={{ padding: '2px 8px', border: '1px solid #ddd', borderRadius: 12 }}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
    </form>
   );
  }