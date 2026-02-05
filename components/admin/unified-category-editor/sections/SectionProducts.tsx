'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  rank?: number;
  overallScore?: number | null;
  status: string;
  ribbon?: string;
}

interface SectionProductsProps {
  products: Product[];
  categoryId?: string;
  onEditProduct: (productId: string) => void;
  onAddProduct: () => void;
  onProductsChange: (products: Product[]) => void;
}

export default function SectionProducts({
  products,
  categoryId,
  onEditProduct,
  onAddProduct,
  onProductsChange,
}: SectionProductsProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Sort products by rank
  const sortedProducts = [...products].sort((a, b) => (a.rank || 999) - (b.rank || 999));

  // Handle drag and drop
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder products
    const newProducts = [...sortedProducts];
    const [draggedProduct] = newProducts.splice(dragIndex, 1);
    newProducts.splice(dropIndex, 0, draggedProduct);

    // Update ranks
    const updatedProducts = newProducts.map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }));

    onProductsChange(updatedProducts);

    // Save new ranks to API
    const token = localStorage.getItem('admin_token');
    for (const product of updatedProducts) {
      try {
        await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rank: product.rank }),
        });
      } catch (err) {
        console.error('Failed to update product rank:', err);
      }
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Handle delete product
  const handleDelete = async (productId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    setDeleting(productId);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onProductsChange(products.filter(p => p.id !== productId));
      } else {
        alert('Xóa sản phẩm thất bại');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Xóa sản phẩm thất bại');
    } finally {
      setDeleting(null);
    }
  };

  if (!categoryId) {
    return (
      <div className="products-notice">
        <p>💡 Vui lòng lưu danh mục trước để thêm sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="product-list__header">
        <span className="product-count">
          {products.length} sản phẩm trong danh mục
        </span>
        <button className="btn-add-product" onClick={onAddProduct}>
          <span>+</span> Thêm sản phẩm
        </button>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="product-list__empty">
          <p>Chưa có sản phẩm nào trong danh mục này</p>
          <button className="btn-add-product" onClick={onAddProduct}>
            <span>+</span> Thêm sản phẩm đầu tiên
          </button>
        </div>
      ) : (
        <div className="product-list__items">
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`product-item ${dragIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
            >
              <span className="product-item__drag" title="Kéo để sắp xếp">
                ⋮⋮
              </span>

              <span className="product-item__rank">
                {product.rank || index + 1}
              </span>

              {product.logoUrl ? (
                <img
                  src={product.logoUrl}
                  alt={product.name}
                  className="product-item__logo"
                />
              ) : (
                <div className="product-item__logo-placeholder">
                  {product.name.charAt(0)}
                </div>
              )}

              <div className="product-item__info">
                <div className="product-item__name">{product.name}</div>
                <div className="product-item__meta">
                  {product.status === 'published' ? (
                    <span className="status-published">Đã xuất bản</span>
                  ) : (
                    <span className="status-draft">Bản nháp</span>
                  )}
                  {product.ribbon && (
                    <span className="product-ribbon">{product.ribbon}</span>
                  )}
                </div>
              </div>

              {product.overallScore != null && (
                <span className="product-item__score">
                  {product.overallScore.toFixed(1)}
                </span>
              )}

              <div className="product-item__actions">
                <button
                  className="btn-action"
                  onClick={() => onEditProduct(product.id)}
                  title="Chỉnh sửa"
                >
                  ✏️
                </button>
                <button
                  className="btn-action delete"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  title="Xóa"
                >
                  {deleting === product.id ? '...' : '🗑'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .products-section {
          margin-top: 16px;
        }

        .products-notice {
          padding: 20px;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          margin-top: 16px;
        }

        .products-notice p {
          margin: 0;
          color: #92400e;
          font-size: 14px;
        }

        .product-count {
          font-size: 14px;
          color: #6b7280;
        }

        .product-item__logo-placeholder {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 700;
          color: #6b7280;
        }

        .product-item.dragging {
          opacity: 0.5;
        }

        .product-item.drag-over {
          border-color: #FE4A64;
          background: #fff5f6;
        }

        .status-published {
          color: #059669;
          font-size: 12px;
        }

        .status-draft {
          color: #d97706;
          font-size: 12px;
        }

        .product-ribbon {
          margin-left: 8px;
          padding: 2px 6px;
          background: #dbeafe;
          color: #1d4ed8;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
