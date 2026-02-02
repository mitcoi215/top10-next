'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CategoryFormData, ProductOption, ScoreBreakdownItem } from './types';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

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

  // Watch form values
  const top3Enabled = watch('comparisonTop3Enabled');
  const top3ProductIds = watch('comparisonTop3ProductIds') || [];
  const rightSidebarEnabled = watch('comparisonRightSidebarEnabled');
  const leftSidebarEnabled = watch('comparisonLeftSidebarEnabled');
  const scoreBreakdown = watch('comparisonScoreBreakdown') || [];

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
      setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'success', text: 'Saved!' } }));
      setTimeout(() => {
        setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'success', text: '' } }));
      }, 2000);
    } catch (err) {
      console.error('Save product error:', err);
      setSaveMessages(prev => ({ ...prev, [product.id]: { type: 'error', text: 'Save failed!' } }));
    } finally {
      setSavingProductId(null);
    }
  };

  // Top 3 product selection helpers
  const toggleTop3Product = (productId: string) => {
    const current = [...top3ProductIds];
    const idx = current.indexOf(productId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else if (current.length < 3) {
      current.push(productId);
    }
    setValue('comparisonTop3ProductIds', current, { shouldDirty: true });
  };

  const moveTop3Product = (fromIdx: number, toIdx: number) => {
    const current = [...top3ProductIds];
    const [item] = current.splice(fromIdx, 1);
    current.splice(toIdx, 0, item);
    setValue('comparisonTop3ProductIds', current, { shouldDirty: true });
  };

  // Score breakdown helpers
  const updateScoreItem = (index: number, field: keyof ScoreBreakdownItem, value: any) => {
    const items = [...scoreBreakdown];
    items[index] = { ...items[index], [field]: value };
    setValue('comparisonScoreBreakdown', items, { shouldDirty: true });
  };

  const addScoreItem = () => {
    setValue('comparisonScoreBreakdown', [
      ...scoreBreakdown,
      { name: '', description: '', score: 8.0 },
    ], { shouldDirty: true });
  };

  const removeScoreItem = (index: number) => {
    setValue('comparisonScoreBreakdown', scoreBreakdown.filter((_: any, i: number) => i !== index), { shouldDirty: true });
  };

  // Auto-load on mount
  if (!loaded && !loadingProducts && categoryId) {
    loadProductData();
  }

  const getProductName = (id: string) => {
    const p = productData.find(pd => pd.id === id) || products.find(pd => pd.id === id);
    return p?.name || id;
  };

  return (
    <div className="tab-comparison">
      {/* Section 1: Hero Settings */}
      <div className="section">
        <h2 className="section-title">Hero trang So sanh</h2>
        <p className="section-desc">Thiet lap noi dung hien thi o phan hero cua trang comparison</p>

        <div className="form-grid">
          <div className="form-group full-width">
            <ImageUpload
              label="Anh nen Hero"
              value={watch('comparisonHeroImage') || ''}
              onChange={(url) => setValue('comparisonHeroImage', url, { shouldDirty: true })}
              placeholder="Tai len hoac nhap URL anh nen hero trang so sanh"
              folder="categories/comparison"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="comparisonTitle">Tieu de trang So sanh</label>
            <input
              id="comparisonTitle"
              type="text"
              {...register('comparisonTitle')}
              placeholder="VD: Best Home Security Systems in 2026"
            />
            <div className="hint">Neu de trong se dung Hero Title cua danh muc hoac tu sinh.</div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="comparisonSubtitle">Mo ta phu</label>
            <textarea
              id="comparisonSubtitle"
              {...register('comparisonSubtitle')}
              rows={3}
              placeholder="VD: Compare the top home security systems side by side..."
            />
            <div className="hint">Neu de trong se dung Meta Description cua danh muc.</div>
          </div>
        </div>
      </div>

      {/* Section 2: Top 3 Products Bar */}
      <div className="section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Top 3 Products Bar</h2>
            <p className="section-desc">Thanh top 3 san pham hien phia tren danh sach so sanh. Neu tat se khong hien thi.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={top3Enabled}
              onChange={(e) => setValue('comparisonTop3Enabled', e.target.checked, { shouldDirty: true })}
            />
            <span className="toggle-slider" />
            <span className="toggle-label">{top3Enabled ? 'Hien' : 'An'}</span>
          </label>
        </div>

        {top3Enabled && (
          <div className="subsection">
            <div className="form-grid">
              <div className="form-group">
                <label>Tieu de Top 3</label>
                <input
                  type="text"
                  {...register('comparisonTop3Title')}
                  placeholder="VD: Top 3 Home Security Services"
                />
              </div>
              <div className="form-group">
                <label>Ribbon cho #1 (san pham dau tien)</label>
                <input
                  type="text"
                  {...register('comparisonTop3Ribbon')}
                  placeholder="VD: Our Recommendation"
                />
              </div>
            </div>

            <div className="top3-selector">
              <label className="features-label">Chon 3 san pham (theo thu tu hien thi)</label>

              {/* Selected products */}
              {top3ProductIds.length > 0 && (
                <div className="selected-products">
                  {top3ProductIds.map((id: string, idx: number) => (
                    <div key={id} className="selected-product-item">
                      <span className="selected-product-rank">#{idx + 1}</span>
                      <span className="selected-product-name">{getProductName(id)}</span>
                      <div className="selected-product-actions">
                        {idx > 0 && (
                          <button type="button" className="btn-move" onClick={() => moveTop3Product(idx, idx - 1)} title="Di chuyen len">
                            &uarr;
                          </button>
                        )}
                        {idx < top3ProductIds.length - 1 && (
                          <button type="button" className="btn-move" onClick={() => moveTop3Product(idx, idx + 1)} title="Di chuyen xuong">
                            &darr;
                          </button>
                        )}
                        <button type="button" className="btn-remove-feature" onClick={() => toggleTop3Product(id)} title="Bo chon">
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available products to select */}
              {top3ProductIds.length < 3 && (
                <div className="available-products">
                  <p className="hint">Chon them san pham ({3 - top3ProductIds.length} vi tri con lai):</p>
                  <div className="product-chips">
                    {productData
                      .filter(p => !top3ProductIds.includes(p.id))
                      .map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className="product-chip"
                          onClick={() => toggleTop3Product(p.id)}
                        >
                          #{p.rank} {p.name}
                          {p.overallScore != null && <span className="chip-score">{p.overallScore.toFixed(1)}</span>}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Right Sidebar (Best Overall) */}
      <div className="section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Sidebar Phai (Best Overall)</h2>
            <p className="section-desc">Hien thi san pham tot nhat ben phai danh sach so sanh. Neu tat se an di.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={rightSidebarEnabled}
              onChange={(e) => setValue('comparisonRightSidebarEnabled', e.target.checked, { shouldDirty: true })}
            />
            <span className="toggle-slider" />
            <span className="toggle-label">{rightSidebarEnabled ? 'Hien' : 'An'}</span>
          </label>
        </div>

        {rightSidebarEnabled && (
          <div className="subsection">
            <div className="form-group">
              <label>Chon san pham hien thi</label>
              <select
                value={watch('comparisonRightSidebarProductId') || ''}
                onChange={(e) => setValue('comparisonRightSidebarProductId', e.target.value, { shouldDirty: true })}
              >
                <option value="">Tu dong (San pham #1 theo rank)</option>
                {productData.map(p => (
                  <option key={p.id} value={p.id}>#{p.rank} {p.name}{p.overallScore != null ? ` (${p.overallScore.toFixed(1)})` : ''}</option>
                ))}
              </select>
              <div className="hint">De trong se tu dong hien thi san pham rank #1</div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Left Sidebar */}
      <div className="section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Sidebar Trai (Score Disclaimer)</h2>
            <p className="section-desc">Social proof, diem chi tiet, Must Reads va Our Reviews. Neu tat se an toan bo sidebar trai.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={leftSidebarEnabled}
              onChange={(e) => setValue('comparisonLeftSidebarEnabled', e.target.checked, { shouldDirty: true })}
            />
            <span className="toggle-slider" />
            <span className="toggle-label">{leftSidebarEnabled ? 'Hien' : 'An'}</span>
          </label>
        </div>

        {leftSidebarEnabled && (
          <div className="subsection">
            <div className="form-group">
              <label>So nguoi da so sanh (Social Proof)</label>
              <input
                type="text"
                {...register('comparisonSocialProofCount')}
                placeholder="VD: 13,810"
              />
              <div className="hint">Neu de trong se tu dong sinh so ngau nhien.</div>
            </div>

            {/* Score Breakdown Items */}
            <div className="score-breakdown-section">
              <label className="features-label">
                Diem chi tiet (Score Breakdown)
                <span className="tooltip" title="Cac muc diem hien thi trong phan Score Disclaimer cua sidebar trai">?</span>
              </label>

              <div className="score-breakdown-list">
                {scoreBreakdown.map((item: ScoreBreakdownItem, idx: number) => (
                  <div key={idx} className="score-breakdown-item">
                    <div className="score-breakdown-row">
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Ten</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateScoreItem(idx, 'name', e.target.value)}
                          placeholder="VD: Popularity"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Diem (0-10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={item.score}
                          onChange={(e) => updateScoreItem(idx, 'score', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-remove-score"
                        onClick={() => removeScoreItem(idx)}
                        title="Xoa"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateScoreItem(idx, 'description', e.target.value)}
                        placeholder="VD: Based on visits in the past 7 days"
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="btn-add-feature" onClick={addScoreItem}>
                  + Them muc diem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Below FAQ Content */}
      <div className="section">
        <h2 className="section-title">Noi dung ben duoi FAQ</h2>
        <p className="section-desc">Noi dung Rich Text hien thi ben duoi phan FAQ tren trang so sanh.</p>

        <RichTextEditor
          label="Noi dung (HTML)"
          value={watch('comparisonBelowFaqContent') || ''}
          onChange={(val) => setValue('comparisonBelowFaqContent', val, { shouldDirty: true })}
          placeholder="Nhap noi dung hien thi ben duoi FAQ..."
        />
      </div>

      {/* Section 6: Products Comparison Data */}
      <div className="section">
        <h2 className="section-title">Du lieu san pham tren trang So sanh</h2>
        <p className="section-desc">
          Chinh sua thong tin hien thi tren Nissim Card cua tung san pham.
          Nhan &quot;Luu&quot; o moi san pham de cap nhat.
        </p>

        {loadingProducts && (
          <div className="loading-state">Dang tai du lieu san pham...</div>
        )}

        {!loadingProducts && !categoryId && (
          <div className="empty-state">Vui long luu danh muc truoc de chinh sua san pham.</div>
        )}

        {!loadingProducts && loaded && productData.length === 0 && (
          <div className="empty-state">Chua co san pham nao trong danh muc nay.</div>
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
                      {product.features.length} diem noi bat
                    </span>
                    <span className="expand-icon">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                  </div>
                </div>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="product-editor">
                    <div className="editor-grid">
                      <div className="form-group">
                        <label>Diem tong (0-10)</label>
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
                        <label>Nhan diem</label>
                        <input
                          type="text"
                          value={product.scoreLabel}
                          onChange={(e) => updateProductField(product.id, 'scoreLabel', e.target.value)}
                          placeholder="VD: Exceptional, Excellent..."
                        />
                      </div>

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
                        <label>Ribbon (nhan dac biet)</label>
                        <input
                          type="text"
                          value={product.ribbon}
                          onChange={(e) => updateProductField(product.id, 'ribbon', e.target.value)}
                          placeholder="VD: Special Offer, Editor's Choice"
                        />
                      </div>

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

                    {/* Features */}
                    <div className="features-section">
                      <label className="features-label">Diem noi bat (Bullet Points)</label>
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
                              title="Xoa"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn-add-feature"
                          onClick={() => addFeature(product.id)}
                        >
                          + Them diem noi bat
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
                        {savingProductId === product.id ? 'Dang luu...' : `Luu ${product.name}`}
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

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .section-header-row .section-desc {
          margin-bottom: 0;
        }

        .subsection {
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Toggle Switch */
        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .toggle-switch input {
          display: none;
        }

        .toggle-slider {
          width: 44px;
          height: 24px;
          background: #d1d5db;
          border-radius: 12px;
          position: relative;
          transition: background 0.3s;
        }

        .toggle-slider::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .toggle-switch input:checked + .toggle-slider {
          background: #10b981;
        }

        .toggle-switch input:checked + .toggle-slider::after {
          transform: translateX(20px);
        }

        .toggle-label {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
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

        /* Top 3 Selector */
        .top3-selector {
          margin-top: 8px;
        }

        .selected-products {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .selected-product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .selected-product-rank {
          font-weight: 700;
          color: #FE4A64;
          font-size: 14px;
          min-width: 28px;
        }

        .selected-product-name {
          flex: 1;
          font-weight: 500;
          color: #1a1a1a;
        }

        .selected-product-actions {
          display: flex;
          gap: 4px;
        }

        .btn-move {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }

        .btn-move:hover {
          background: #e5e7eb;
        }

        .available-products {
          margin-top: 8px;
        }

        .product-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .product-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          color: #374151;
          transition: all 0.2s;
        }

        .product-chip:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .chip-score {
          background: #10b981;
          color: white;
          padding: 1px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Score Breakdown */
        .score-breakdown-section {
          margin-top: 8px;
        }

        .score-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .score-breakdown-item {
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .score-breakdown-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .btn-remove-score {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          color: #dc2626;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
          margin-bottom: 6px;
        }

        .btn-remove-score:hover {
          background: #fecaca;
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

        /* Product Editor */
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

          .section-header-row {
            flex-direction: column;
            gap: 12px;
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

          .score-breakdown-row {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-remove-score {
            align-self: flex-end;
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}
