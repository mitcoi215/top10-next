'use client';

import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { CategoryFormData, ProductOption } from './types';

interface Tab2Props {
  products: ProductOption[];
}

export default function Tab2RankingDisplay({ products }: Tab2Props) {
  const { register, watch, setValue } = useFormContext<CategoryFormData>();
  const productOrder = watch('productOrder') || [];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get products that are in the order list
  const orderedProducts = productOrder
    .map(id => products.find(p => p.id === id))
    .filter((p): p is ProductOption => p !== undefined);

  // Get products not yet added to the order
  const availableProducts = products.filter(p => !productOrder.includes(p.id));

  const addProduct = (productId: string) => {
    setValue('productOrder', [...productOrder, productId], { shouldDirty: true });
  };

  const removeProduct = (productId: string) => {
    setValue('productOrder', productOrder.filter(id => id !== productId), { shouldDirty: true });
  };

  const moveProduct = (fromIndex: number, toIndex: number) => {
    const newOrder = [...productOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setValue('productOrder', newOrder, { shouldDirty: true });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    moveProduct(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveProduct(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < productOrder.length - 1) {
      moveProduct(index, index + 1);
    }
  };

  return (
    <div className="tab-ranking-display">
      <div className="section">
        <h2 className="section-title">Hero Section</h2>
        <p className="section-desc">Category landing page hero content</p>

        <div className="form-grid">
          {/* Hero Image */}
          <div className="form-group full-width">
            <label htmlFor="heroImage">
              Hero Image URL
              <span className="tooltip" title="Main banner image for the category page">?</span>
            </label>
            <input
              id="heroImage"
              type="text"
              {...register('heroImage')}
              placeholder="/images/categories/tv-services-hero.jpg"
            />
            {watch('heroImage') && (
              <div className="image-preview">
                <img src={watch('heroImage')} alt="Hero preview" />
              </div>
            )}
          </div>

          {/* Hero Title */}
          <div className="form-group full-width">
            <label htmlFor="heroTitle">
              Hero Title
              <span className="tooltip" title="Main heading displayed over hero image">?</span>
            </label>
            <input
              id="heroTitle"
              type="text"
              {...register('heroTitle')}
              placeholder="e.g., Best TV Streaming Services of 2026"
            />
          </div>

          {/* Intro Content */}
          <div className="form-group full-width">
            <label htmlFor="introContent">
              Introduction Content
              <span className="tooltip" title="HTML/Rich text intro below the hero">?</span>
            </label>
            <textarea
              id="introContent"
              {...register('introContent')}
              placeholder="Enter HTML content for the category introduction..."
              rows={6}
            />
            <div className="hint">Supports HTML formatting. This appears below the hero section.</div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Product Ranking</h2>
        <p className="section-desc">Select and order products for this category. Drag to reorder or use arrow buttons.</p>

        <div className="product-ordering">
          {/* Ordered Products */}
          <div className="ordered-products">
            <h3>Ranked Products ({orderedProducts.length})</h3>
            {orderedProducts.length === 0 ? (
              <div className="empty-state">
                No products added yet. Add products from the list on the right.
              </div>
            ) : (
              <ul className="product-list">
                {orderedProducts.map((product, index) => (
                  <li
                    key={product.id}
                    className={`product-item ${draggedIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="rank-number">#{index + 1}</span>
                    <div className="drag-handle" title="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="4" cy="3" r="1.5" />
                        <circle cx="4" cy="8" r="1.5" />
                        <circle cx="4" cy="13" r="1.5" />
                        <circle cx="10" cy="3" r="1.5" />
                        <circle cx="10" cy="8" r="1.5" />
                        <circle cx="10" cy="13" r="1.5" />
                      </svg>
                    </div>
                    {product.logoUrl && (
                      <img src={product.logoUrl} alt={product.name} className="product-logo" />
                    )}
                    <span className="product-name">{product.name}</span>
                    <div className="product-actions">
                      <button
                        type="button"
                        className="btn-move"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 2L10 8H2L6 2Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn-move"
                        onClick={() => moveDown(index)}
                        disabled={index === productOrder.length - 1}
                        title="Move down"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M6 10L2 4H10L6 10Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeProduct(product.id)}
                        title="Remove from list"
                      >
                        x
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Available Products */}
          <div className="available-products">
            <h3>Available Products ({availableProducts.length})</h3>
            {availableProducts.length === 0 ? (
              <div className="empty-state">
                All products have been added.
              </div>
            ) : (
              <ul className="product-list available">
                {availableProducts.map((product) => (
                  <li key={product.id} className="product-item available">
                    {product.logoUrl && (
                      <img src={product.logoUrl} alt={product.name} className="product-logo" />
                    )}
                    <span className="product-name">{product.name}</span>
                    <button
                      type="button"
                      className="btn-add"
                      onClick={() => addProduct(product.id)}
                      title="Add to ranking"
                    >
                      + Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tab-ranking-display {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section {
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .section-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tooltip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: #e5e7eb;
          border-radius: 50%;
          font-size: 10px;
          color: #6b7280;
          cursor: help;
          margin-left: 4px;
        }

        input, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
          border-radius: 4px;
        }

        .product-ordering {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .ordered-products,
        .available-products {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
        }

        .ordered-products h3,
        .available-products h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }

        .empty-state {
          padding: 24px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          background: white;
          border-radius: 6px;
          border: 2px dashed #e5e7eb;
        }

        .product-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .product-item:hover {
          border-color: #d1d5db;
        }

        .product-item.dragging {
          opacity: 0.5;
          background: #f3f4f6;
        }

        .rank-number {
          font-size: 14px;
          font-weight: 700;
          color: #FE4A64;
          min-width: 32px;
        }

        .drag-handle {
          cursor: grab;
          color: #9ca3af;
          padding: 4px;
        }

        .drag-handle:hover {
          color: #6b7280;
        }

        .product-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
          border-radius: 4px;
        }

        .product-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .product-actions {
          display: flex;
          gap: 4px;
        }

        .btn-move {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #f3f4f6;
          border-radius: 4px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-move:hover:not(:disabled) {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-move:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .btn-remove {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #fee2e2;
          border-radius: 4px;
          color: #dc2626;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 6px 12px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-add:hover {
          background: #e5435b;
        }

        .product-list.available .product-item {
          cursor: pointer;
        }

        .product-list.available .product-item:hover {
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .product-ordering {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
