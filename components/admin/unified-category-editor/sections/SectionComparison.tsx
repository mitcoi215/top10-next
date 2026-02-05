'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CategoryFormData, ScoreBreakdownItem } from '../types';
import ImageUpload from '../../category-editor/ImageUpload';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../category-editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

interface Product {
  id: string;
  name: string;
  rank?: number;
  overallScore?: number | null;
}

interface SectionComparisonProps {
  products: Product[];
  categoryId?: string;
}

export default function SectionComparison({ products, categoryId }: SectionComparisonProps) {
  const { register, watch, setValue, control } = useFormContext<CategoryFormData>();
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(new Set(['hero']));

  const top3Enabled = watch('comparisonTop3Enabled');
  const top3ProductIds = watch('comparisonTop3ProductIds') || [];
  const leftSidebarEnabled = watch('comparisonLeftSidebarEnabled');
  const rightSidebarEnabled = watch('comparisonRightSidebarEnabled');
  const scoreBreakdown = watch('comparisonScoreBreakdown') || [];

  const toggleSubsection = (id: string) => {
    setExpandedSubsections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Top 3 product helpers
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

  const getProductName = (id: string) => {
    const p = products.find(pd => pd.id === id);
    return p?.name || id;
  };

  return (
    <div className="comparison-section">
      {/* Redirect Toggle */}
      <div className="toggle-row">
        <div className="toggle-info">
          <h4>Chuyển hướng tự động</h4>
          <p>Khi bật, truy cập /{watch('slug') || 'category'} sẽ tự động chuyển sang trang comparison</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={watch('comparisonRedirectEnabled') || false}
            onChange={(e) => setValue('comparisonRedirectEnabled', e.target.checked, { shouldDirty: true })}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {/* Hero Subsection */}
      <div className={`subsection ${expandedSubsections.has('hero') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('hero')}>
          <h3>🖼️ Hero trang So sánh</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('hero') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('hero') && (
          <div className="subsection-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <ImageUpload
                  label="Ảnh nền Hero"
                  value={watch('comparisonHeroImage') || ''}
                  onChange={(url) => setValue('comparisonHeroImage', url, { shouldDirty: true })}
                  placeholder="Tải lên ảnh nền hero"
                  folder="categories/comparison"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tiêu đề</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('comparisonTitle')}
                  placeholder="VD: Best Home Security Systems 2026"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả phụ</label>
                <textarea
                  className="form-textarea"
                  {...register('comparisonSubtitle')}
                  placeholder="Mô tả ngắn về trang so sánh..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Bar Subsection */}
      <div className={`subsection ${expandedSubsections.has('top3') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('top3')}>
          <h3>🏆 Top 3 Products Bar</h3>
          <div className="subsection-header-right">
            <label className="toggle-switch small" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={top3Enabled || false}
                onChange={(e) => setValue('comparisonTop3Enabled', e.target.checked, { shouldDirty: true })}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="subsection-toggle">
              {expandedSubsections.has('top3') ? '▼' : '▶'}
            </span>
          </div>
        </div>
        {expandedSubsections.has('top3') && top3Enabled && (
          <div className="subsection-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Tiêu đề Top 3</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('comparisonTop3Title')}
                  placeholder="VD: Top 3 Home Security Services"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ribbon cho #1</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('comparisonTop3Ribbon')}
                  placeholder="VD: Our Recommendation"
                />
              </div>
            </div>

            <div className="top3-selector">
              <label className="form-label">Chọn 3 sản phẩm (tối đa)</label>

              {/* Selected products */}
              {top3ProductIds.length > 0 && (
                <div className="selected-items">
                  {top3ProductIds.map((id: string, idx: number) => (
                    <div key={id} className="selected-item">
                      <span className="selected-rank">#{idx + 1}</span>
                      <span className="selected-name">{getProductName(id)}</span>
                      <button
                        type="button"
                        className="btn-remove-small"
                        onClick={() => toggleTop3Product(id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Available products */}
              {top3ProductIds.length < 3 && (
                <div className="available-products">
                  <p className="form-hint">Chọn thêm ({3 - top3ProductIds.length} vị trí còn lại):</p>
                  <div className="product-chips">
                    {products
                      .filter(p => !top3ProductIds.includes(p.id))
                      .slice(0, 10)
                      .map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className="product-chip"
                          onClick={() => toggleTop3Product(p.id)}
                        >
                          #{p.rank} {p.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Left Sidebar Subsection */}
      <div className={`subsection ${expandedSubsections.has('sidebar') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('sidebar')}>
          <h3>📊 Sidebar trái (Score Breakdown)</h3>
          <div className="subsection-header-right">
            <label className="toggle-switch small" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={leftSidebarEnabled || false}
                onChange={(e) => setValue('comparisonLeftSidebarEnabled', e.target.checked, { shouldDirty: true })}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="subsection-toggle">
              {expandedSubsections.has('sidebar') ? '▼' : '▶'}
            </span>
          </div>
        </div>
        {expandedSubsections.has('sidebar') && leftSidebarEnabled && (
          <div className="subsection-content">
            <div className="form-group">
              <label className="form-label">Số người đã so sánh (Social Proof)</label>
              <input
                type="text"
                className="form-input"
                {...register('comparisonSocialProofCount')}
                placeholder="VD: 13,810"
              />
              <span className="form-hint">Để trống sẽ tự động sinh số</span>
            </div>

            <div className="score-breakdown-section">
              <label className="form-label">Điểm chi tiết (Score Breakdown)</label>
              {scoreBreakdown.map((item: ScoreBreakdownItem, idx: number) => (
                <div key={idx} className="score-item">
                  <div className="score-item-row">
                    <input
                      type="text"
                      className="form-input"
                      value={item.name}
                      onChange={(e) => updateScoreItem(idx, 'name', e.target.value)}
                      placeholder="Tên (VD: Popularity)"
                    />
                    <input
                      type="number"
                      className="form-input score-input"
                      min="0"
                      max="10"
                      step="0.1"
                      value={item.score}
                      onChange={(e) => updateScoreItem(idx, 'score', parseFloat(e.target.value) || 0)}
                    />
                    <button
                      type="button"
                      className="btn-remove-small"
                      onClick={() => removeScoreItem(idx)}
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    value={item.description}
                    onChange={(e) => updateScoreItem(idx, 'description', e.target.value)}
                    placeholder="Mô tả (VD: Based on user visits)"
                  />
                </div>
              ))}
              <button type="button" className="btn-add-item" onClick={addScoreItem}>
                + Thêm mục điểm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar Subsection (Best Overall) */}
      <div className={`subsection ${expandedSubsections.has('rightSidebar') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('rightSidebar')}>
          <h3>🏅 Sidebar phải (Best Overall)</h3>
          <div className="subsection-header-right">
            <label className="toggle-switch small" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={rightSidebarEnabled || false}
                onChange={(e) => setValue('comparisonRightSidebarEnabled', e.target.checked, { shouldDirty: true })}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="subsection-toggle">
              {expandedSubsections.has('rightSidebar') ? '▼' : '▶'}
            </span>
          </div>
        </div>
        {expandedSubsections.has('rightSidebar') && rightSidebarEnabled && (
          <div className="subsection-content">
            <div className="form-group">
              <label className="form-label">Chọn sản phẩm Best Overall</label>
              <select
                className="form-select"
                value={watch('comparisonRightSidebarProductId') || ''}
                onChange={(e) => setValue('comparisonRightSidebarProductId', e.target.value, { shouldDirty: true })}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.rank} {p.name}
                  </option>
                ))}
              </select>
              <span className="form-hint">Sản phẩm này sẽ hiển thị trong sidebar phải với badge "Best Overall"</span>
            </div>
          </div>
        )}
      </div>

      {/* Below FAQ Content Subsection */}
      <div className={`subsection ${expandedSubsections.has('belowFaq') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('belowFaq')}>
          <h3>📝 Nội dung bên dưới FAQ</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('belowFaq') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('belowFaq') && (
          <div className="subsection-content">
            <p className="section-desc">Nội dung rich text hiển thị bên dưới phần FAQ của trang comparison</p>
            <RichTextEditor
              value={watch('comparisonBelowFaqContent') || ''}
              onChange={(value) => setValue('comparisonBelowFaqContent', value, { shouldDirty: true })}
              placeholder="Viết nội dung bổ sung cho trang comparison..."
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .comparison-section {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }

        .toggle-info h4 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 4px;
        }

        .toggle-info p {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          cursor: pointer;
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
        }

        .toggle-switch input:checked + .toggle-slider {
          background: #10b981;
        }

        .toggle-switch input:checked + .toggle-slider::after {
          transform: translateX(20px);
        }

        .toggle-switch.small .toggle-slider {
          width: 36px;
          height: 20px;
        }

        .toggle-switch.small .toggle-slider::after {
          width: 14px;
          height: 14px;
        }

        .toggle-switch.small input:checked + .toggle-slider::after {
          transform: translateX(16px);
        }

        .subsection {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .subsection.expanded {
          background: white;
        }

        .subsection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .subsection-header:hover {
          background: #f3f4f6;
        }

        .subsection-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .subsection-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subsection-toggle {
          font-size: 12px;
          color: #9ca3af;
        }

        .subsection-content {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .top3-selector {
          margin-top: 16px;
        }

        .selected-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .selected-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .selected-rank {
          font-weight: 700;
          color: #FE4A64;
        }

        .selected-name {
          flex: 1;
          font-weight: 500;
        }

        .btn-remove-small {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          border: none;
          border-radius: 4px;
          color: #dc2626;
          cursor: pointer;
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
          padding: 6px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .product-chip:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .score-breakdown-section {
          margin-top: 20px;
        }

        .score-item {
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .score-item-row {
          display: flex;
          gap: 8px;
        }

        .score-item-row .form-input {
          flex: 1;
        }

        .score-input {
          width: 80px !important;
          flex: none !important;
        }

        .btn-add-item {
          width: 100%;
          padding: 12px;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
          margin-top: 8px;
        }

        .btn-add-item:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .form-select:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .section-desc {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
