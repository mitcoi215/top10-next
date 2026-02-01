'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CategoryFormData, ProductOption } from './types';
import ImageUpload from './ImageUpload';

interface ProductComparisonData {
  id: string;
  name: string;
  rank: number;
  logoUrl: string;
  overallScore: number | null;
  scoreLabel: string;
  bottomLine: string;
  ribbon: string;
  ctaUrl: string;
  ctaText: string;
  features: string[];
}

interface Tab5Props {
  products: ProductOption[];
  categoryId?: string;
}

export default function Tab5Comparison({ products, categoryId }: Tab5Props) {
  const { register, watch, setValue } = useFormContext<CategoryFormData>();
  const [productData, setProductData] = useState<ProductComparisonData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [saveMessages, setSaveMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({});

  // Load full product data for comparison editing
  const loadProductData = async () => {
    if (!categoryId || loaded) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const prods: ProductComparisonData[] = (data.products || [])
        .sort((a: any, b: any) => (a.rank || 999) - (b.rank || 999))
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          rank: p.rank || 0,
          logoUrl: p.logoUrl || '',
          overallScore: p.overallScore ?? null,
          scoreLabel: p.scoreLabel || '',
          bottomLine: p.bottomLine || '',
          ribbon: p.ribbon || '',
          ctaUrl: p.ctaUrl || '',
          ctaText: p.ctaText || 'Visit Site',
          features: parseFeatures(p.features),
        }));
      setProductData(prods);
      setLoaded(true);
    } catch (err) {
      console.error('Load products error:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  function parseFeatures(features: any): string[] {
    if (Array.isArray(features)) {
      return features.map((f: any) => typeof f === 'string' ? f : (f.text || String(f)));
    }
    if (features && typeof features === 'object') {
      return Object.entries(features)
        .filter(([, v]) => v && v !== 'false')
        .map(([k, v]) => (typeof v === 'string' && v !== 'true' ? v : k));
    }
    return [];
  }

  // Update a product field locally
  const updateProductField = (productId: string, field: keyof ProductComparisonData, value: any) => {
    setProductData(prev => prev.map(p =>
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  // Update feature at index
  const updateFeature = (productId: string, index: number, value: string) => {
    setProductData(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const newFeatures = [...p.features];
      newFeatures[index] = value;
      return { ...p, features: newFeatures };
    }));
  };

  const addFeature = (productId: string) => {
    setProductData(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, features: [...p.features, ''] };
    }));
  };

  const removeFeature = (productId: string, index: number) => {
    setProductData(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, features: p.features.filter((_, i) => i !== index) };
    }));
  };

  // Save individual product
  const saveProduct = async (product: ProductComparisonData) => {
    setSavingProductId(product.id);
    setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'success', text: '' } }));
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          overallScore: product.overallScore,
          scoreLabel: product.scoreLabel || null,
          bottomLine: product.bottomLine || null,
          ribbon: product.ribbon || null,
          ctaUrl: product.ctaUrl || null,
          ctaText: product.ctaText || 'Visit Site',
          features: product.features.filter(f => f.trim() !== ''),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'success', text: 'Đã lưu!' } }));
      setTimeout(() => {
        setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'success', text: '' } }));
      }, 2000);
    } catch (err) {
      console.error('Save product error:', err);
      setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'error', text: 'Lưu thất bại!' } }));
    } finally {
      setSavingProductId(null);
    }
  };

  // Auto-load on mount
  if (!loaded && !loadingProducts && categoryId) {
    loadProductData();
  }

  return (
    <div className="tab-comparison">
      {/* Section 1: Comparison Page Hero Settings */}
      <div className="section">
        <h2 className="section-title">Cài đặt trang So sánh</h2>
        <p className="section-desc">Thiết lập nội dung hiển thị ở phần hero của trang comparison</p>

        <div className="form-grid">
          <div className="form-group full-width">
            <ImageUpload
              label="Ảnh nền Hero"
              value={watch('comparisonHeroImage') || ''}
              onChange={(url) => setValue('comparisonHeroImage', url, { shouldDirty: true })}
              placeholder="Tải lên hoặc nhập URL ảnh nền hero trang so sánh"
              folder="categories/comparison"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="comparisonTitle">
              Tiêu đề trang So sánh
              <span className="tooltip" title="Tiêu đề hiển thị trên hero section của trang comparison">?</span>
            </label>
            <input
              id="comparisonTitle"
              type="text"
              {...register('comparisonTitle')}
              placeholder="VD: Best Home Security Systems in 2026"
            />
            <div className="hint">Nếu để trống sẽ dùng Hero Title của danh mục hoặc tự sinh.</div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="comparisonSubtitle">
              Mô tả phụ
              <span className="tooltip" title="Đoạn text mô tả bên dưới tiêu đề hero">?</span>
            </label>
            <textarea
              id="comparisonSubtitle"
              {...register('comparisonSubtitle')}
              rows={3}
              placeholder="VD: Compare the top home security systems side by side..."
            />
            <div className="hint">Nếu để trống sẽ dùng Meta Description của danh mục.</div>
          </div>
        </div>
      </div>

      {/* Section 2: Products Comparison Data */}
      <div className="section">
        <h2 className="section-title">Dữ liệu sản phẩm trên trang So sánh</h2>
        <p className="section-desc">
          Chỉnh sửa thông tin hiển thị trên Nissim Card của từng sản phẩm.
          Nhấn &quot;Lưu&quot; ở mỗi sản phẩm để cập nhật.
        </p>

        {loadingProducts && (
          <div className="loading-state">Đang tải dữ liệu sản phẩm...</div>
        )}

        {!loadingProducts && !categoryId && (
          <div className="empty-state">Vui lòng lưu danh mục trước để chỉnh sửa sản phẩm.</div>
        )}

        {!loadingProducts && loaded && productData.length === 0 && (
          <div className="empty-state">Chưa có sản phẩm nào trong danh mục này.</div>
        )}

        <div className="product-list">
          {productData.map((product) => {
            const isExpanded = expandedProduct === product.id;
            const msg = saveMessages[product.id];
            return (
              <div key={product.id} className={`product-item ${isExpanded ? 'expanded' : ''}`}>
                {/* Collapsed header */}
                <div className="product-header" onClick={() => setExpandedProduct(isExpanded ? null : product.id)}>
                  <div className="product-header-left">
                    <span className="product-rank">#{product.rank}</span>
                    {product.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.logoUrl} alt={product.name} className="product-logo" />
                    ) : (
                      <span className="product-name-text">{product.name}</span>
                    )}
                    <span className="product-name-label">{product.name}</span>
                  </div>
                  <div className="product-header-right">
                    {product.overallScore != null && (
                      <span className="product-score-badge">{product.overallScore.toFixed(1)}</span>
                    )}
                    <span className={`product-features-count ${product.features.length === 0 ? 'empty' : ''}`}>
                      {product.features.length} điểm nổi bật
                    </span>
                    <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="product-editor">
                    <div className="editor-grid">
                      {/* Row 1: Score + Label */}
                      <div className="form-group">
                        <label>Điểm tổng (0-10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={product.overallScore ?? ''}
                          onChange={(e) => updateProductField(product.id, 'overallScore', e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Nhãn điểm</label>
                        <input
                          type="text"
                          value={product.scoreLabel}
                          onChange={(e) => updateProductField(product.id, 'scoreLabel', e.target.value)}
                          placeholder="VD: Exceptional, Excellent..."
                        />
                      </div>

                      {/* Row 2: Bottom Line + Ribbon */}
                      <div className="form-group">
                        <label>Bottom Line (tagline)</label>
                        <input
                          type="text"
                          value={product.bottomLine}
                          onChange={(e) => updateProductField(product.id, 'bottomLine', e.target.value)}
                          placeholder="VD: Advanced equipment and custom-built security"
                        />
                      </div>
                      <div className="form-group">
                        <label>Ribbon (nhãn đặc biệt)</label>
                        <input
                          type="text"
                          value={product.ribbon}
                          onChange={(e) => updateProductField(product.id, 'ribbon', e.target.value)}
                          placeholder="VD: Special Offer, Editor's Choice"
                        />
                      </div>

                      {/* Row 3: CTA URL + Text */}
                      <div className="form-group">
                        <label>CTA URL (affiliate link)</label>
                        <input
                          type="text"
                          value={product.ctaUrl}
                          onChange={(e) => updateProductField(product.id, 'ctaUrl', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>CTA Text</label>
                        <input
                          type="text"
                          value={product.ctaText}
                          onChange={(e) => updateProductField(product.id, 'ctaText', e.target.value)}
                          placeholder="Visit Site"
                        />
                      </div>
                    </div>

                    {/* Features / Bullet Points */}
                    <div className="features-section">
                      <label className="features-label">
                        Điểm nổi bật (Bullet Points)
                        <span className="tooltip" title="Các dòng text hiển thị trên Nissim Card với icon checkmark">?</span>
                      </label>
                      <div className="features-list">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="feature-item">
                            <span className="feature-index">{idx + 1}</span>
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeature(product.id, idx, e.target.value)}
                              placeholder="VD: 24/7 professional monitoring"
                            />
                            <button
                              type="button"
                              className="btn-remove-feature"
                              onClick={() => removeFeature(product.id, idx)}
                              title="Xóa"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn-add-feature"
                          onClick={() => addFeature(product.id)}
                        >
                          + Thêm điểm nổi bật
                        </button>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="product-actions">
                      {msg?.text && (
                        <span className={`save-msg ${msg.type}`}>{msg.text}</span>
                      )}
                      <button
                        type="button"
                        className="btn-save-product"
                        onClick={() => saveProduct(product)}
                        disabled={savingProductId === product.id}
                      >
                        {savingProductId === product.id ? 'Đang lưu...' : `Lưu ${product.name}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .tab-comparison {
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

        input, textarea, select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        textarea {
          resize: vertical;
        }

        .hint {
          font-size: 12px;
          color: #9ca3af;
        }

        /* Product List */
        .product-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .loading-state, .empty-state {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }

        .product-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .product-item.expanded {
          border-color: #FE4A64;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          background: #fafafa;
          transition: background 0.2s;
        }

        .product-header:hover {
          background: #f3f4f6;
        }

        .product-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-rank {
          font-weight: 700;
          font-size: 14px;
          color: #FE4A64;
          min-width: 24px;
        }

        .product-logo {
          max-width: 80px;
          max-height: 30px;
          object-fit: contain;
        }

        .product-name-text {
          font-weight: 600;
          font-size: 14px;
          color: #1a1a1a;
        }

        .product-name-label {
          font-size: 13px;
          color: #6b7280;
        }

        .product-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-score-badge {
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .product-features-count {
          font-size: 12px;
          color: #059669;
          background: #d1fae5;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .product-features-count.empty {
          color: #dc2626;
          background: #fee2e2;
        }

        .expand-icon {
          font-size: 10px;
          color: #6b7280;
        }

        /* Product Editor (expanded) */
        .product-editor {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .editor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        /* Features Section */
        .features-section {
          margin-bottom: 16px;
        }

        .features-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .feature-index {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          flex-shrink: 0;
        }

        .feature-item input {
          flex: 1;
        }

        .btn-remove-feature {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          border: none;
          border-radius: 4px;
          color: #dc2626;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .btn-remove-feature:hover {
          background: #fecaca;
        }

        .btn-add-feature {
          padding: 8px;
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          background: transparent;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-feature:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        /* Product Actions */
        .product-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .save-msg {
          font-size: 13px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .save-msg.success {
          color: #059669;
          background: #d1fae5;
        }

        .save-msg.error {
          color: #dc2626;
          background: #fee2e2;
        }

        .btn-save-product {
          padding: 8px 20px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-save-product:hover:not(:disabled) {
          background: #e5435b;
        }

        .btn-save-product:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid, .editor-grid {
            grid-template-columns: 1fr;
          }

          .product-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .product-header-right {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
