'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData, COLOR_PRESETS, ICON_PRESETS } from './types';

export default function Tab1GeneralInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CategoryFormData>();

  const name = watch('name');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  // Auto-generate slug from name
  const generateSlug = () => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };

  // Auto-generate SEO fields
  const generateSeoFields = () => {
    if (name) {
      setValue('metaTitle', `Best ${name} 2026 - Compare Top 10 Options | Top10`);
      setValue('metaDescription', `Compare the best ${name.toLowerCase()} of 2026. Expert reviews, detailed comparisons, and recommendations to help you find the perfect option.`);
    }
  };

  return (
    <div className="tab-general-info">
      <div className="section">
        <h2 className="section-title">Basic Information</h2>
        <p className="section-desc">Core category identification and display settings</p>

        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              Category Name <span className="required">*</span>
              <span className="tooltip" title="Display name for this category">?</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Category name is required' })}
              placeholder="e.g., TV Services, Dating, VPN"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          {/* Slug */}
          <div className="form-group">
            <label htmlFor="slug">
              URL Slug <span className="required">*</span>
              <span className="tooltip" title="Used in URLs, auto-generated from name">?</span>
            </label>
            <div className="input-with-btn">
              <input
                id="slug"
                type="text"
                {...register('slug', {
                  required: 'Slug is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Only lowercase letters, numbers, and hyphens'
                  }
                })}
                placeholder="e.g., tv-services"
                className={errors.slug ? 'error' : ''}
              />
              <button type="button" className="btn-gen" onClick={generateSlug}>
                Generate
              </button>
            </div>
            {errors.slug && <span className="error-msg">{errors.slug.message}</span>}
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">
              Short Description
              <span className="tooltip" title="Brief description for category cards">?</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="A brief description of what this category covers..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Appearance</h2>
        <p className="section-desc">Visual styling for the category</p>

        <div className="form-grid">
          {/* Icon */}
          <div className="form-group">
            <label>
              Icon
              <span className="tooltip" title="Emoji icon displayed with category name">?</span>
            </label>
            <div className="icon-picker">
              <div className="current-icon">{selectedIcon}</div>
              <div className="icon-grid">
                {ICON_PRESETS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                    onClick={() => setValue('icon', icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                {...register('icon')}
                placeholder="Or enter custom emoji"
                className="custom-icon-input"
              />
            </div>
          </div>

          {/* Color */}
          <div className="form-group">
            <label>
              Color Theme
              <span className="tooltip" title="Primary color for category styling">?</span>
            </label>
            <div className="color-picker">
              <div className="color-grid">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setValue('color', color.value)}
                    title={color.label}
                  />
                ))}
              </div>
              <div className="color-preview">
                Selected: <span className="color-name">{COLOR_PRESETS.find(c => c.value === selectedColor)?.label || selectedColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Display Settings</h2>
        <p className="section-desc">Control how this category appears on the site</p>

        <div className="form-grid">
          {/* Featured */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('featured')}
              />
              <span className="checkbox-text">
                Featured Category
                <span className="checkbox-hint">Show in featured sections on homepage</span>
              </span>
            </label>
          </div>

          {/* Order */}
          <div className="form-group">
            <label htmlFor="order">
              Display Order
              <span className="tooltip" title="Lower numbers appear first">?</span>
            </label>
            <input
              id="order"
              type="number"
              min="0"
              {...register('order', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">SEO Settings</h2>
        <p className="section-desc">Search engine optimization for category pages</p>

        <div className="seo-actions">
          <button type="button" className="btn-generate" onClick={generateSeoFields}>
            Auto-generate SEO fields
          </button>
        </div>

        <div className="form-grid">
          {/* Meta Title */}
          <div className="form-group full-width">
            <label htmlFor="metaTitle">
              Meta Title
              <span className="tooltip" title="Title shown in search results (50-60 chars)">?</span>
            </label>
            <input
              id="metaTitle"
              type="text"
              {...register('metaTitle')}
              placeholder="Best [Category] 2026 - Compare Top 10 | Top10"
            />
            <div className="char-count">
              {(watch('metaTitle') || '').length} / 60 characters
            </div>
          </div>

          {/* Meta Description */}
          <div className="form-group full-width">
            <label htmlFor="metaDescription">
              Meta Description
              <span className="tooltip" title="Description in search results (150-160 chars)">?</span>
            </label>
            <textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="A compelling description for search engines..."
              rows={3}
            />
            <div className="char-count">
              {(watch('metaDescription') || '').length} / 160 characters
            </div>
          </div>

          {/* OG Image */}
          <div className="form-group full-width">
            <label htmlFor="ogImage">
              OG Image URL
              <span className="tooltip" title="Image for social media sharing">?</span>
            </label>
            <input
              id="ogImage"
              type="text"
              {...register('ogImage')}
              placeholder="/images/og/category-name.jpg"
            />
            {watch('ogImage') && (
              <div className="image-preview">
                <img src={watch('ogImage')} alt="OG preview" />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .tab-general-info {
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

        .required { color: #dc2626; }

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

        input, select, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        input.error, select.error {
          border-color: #dc2626;
        }

        .error-msg {
          font-size: 12px;
          color: #dc2626;
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .input-with-btn {
          display: flex;
          gap: 8px;
        }

        .input-with-btn input {
          flex: 1;
        }

        .btn-gen {
          padding: 10px 16px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .btn-gen:hover {
          background: #e5e7eb;
        }

        .icon-picker {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .current-icon {
          font-size: 32px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }

        .icon-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .icon-option {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-option:hover {
          border-color: #d1d5db;
          background: #f3f4f6;
        }

        .icon-option.selected {
          border-color: #FE4A64;
          background: #fff5f6;
        }

        .custom-icon-input {
          max-width: 200px;
        }

        .color-picker {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .color-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .color-option {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-option:hover {
          transform: scale(1.1);
        }

        .color-option.selected {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #1a1a1a;
        }

        .color-preview {
          font-size: 13px;
          color: #6b7280;
        }

        .color-name {
          font-weight: 600;
          color: #374151;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
        }

        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .checkbox-hint {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 400;
        }

        .seo-actions {
          margin-bottom: 20px;
        }

        .btn-generate {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-generate:hover {
          opacity: 0.9;
        }

        .char-count {
          font-size: 12px;
          color: #9ca3af;
          text-align: right;
        }

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .image-preview img {
          max-width: 200px;
          max-height: 100px;
          object-fit: contain;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
