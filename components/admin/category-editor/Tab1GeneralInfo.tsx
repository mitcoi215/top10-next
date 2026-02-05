'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData, COLOR_PRESETS, ICON_PRESETS } from './types';
import ImageUpload from './ImageUpload';

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
}

interface Tab1Props {
  categoryGroups?: CategoryGroup[];
}

export default function Tab1GeneralInfo({ categoryGroups = [] }: Tab1Props) {
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
        <h2 className="section-title">Thông tin cơ bản</h2>
        <p className="section-desc">Cài đặt nhận dạng và hiển thị danh mục cốt lõi</p>

        <div className="form-grid">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">
              Tên danh mục <span className="required">*</span>
              <span className="tooltip" title="Tên hiển thị cho danh mục này">?</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Tên danh mục là bắt buộc' })}
              placeholder="VD: Dịch vụ TV, Dating, VPN"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          {/* Slug */}
          <div className="form-group">
            <label htmlFor="slug">
              URL Slug <span className="required">*</span>
              <span className="tooltip" title="Dùng trong URL, tự động tạo từ tên">?</span>
            </label>
            <div className="input-with-btn">
              <input
                id="slug"
                type="text"
                {...register('slug', {
                  required: 'Slug là bắt buộc',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Chỉ chữ thường, số và gạch ngang'
                  }
                })}
                placeholder="VD: dich-vu-tv"
                className={errors.slug ? 'error' : ''}
              />
              <button type="button" className="btn-gen" onClick={generateSlug}>
                Tạo tự động
              </button>
            </div>
            {errors.slug && <span className="error-msg">{errors.slug.message}</span>}
          </div>

          {/* Category Group */}
          <div className="form-group">
            <label htmlFor="groupId">
              Nhóm danh mục
              <span className="tooltip" title="Nhóm hiển thị trong Hero Section trang chủ">?</span>
            </label>
            <select
              id="groupId"
              {...register('groupId')}
            >
              <option value="">-- Không thuộc nhóm nào --</option>
              {categoryGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <span className="help-text">Danh mục sẽ hiển thị trong dropdown Hero Section nếu thuộc một nhóm</span>
          </div>

        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Giao diện</h2>
        <p className="section-desc">Cài đặt giao diện cho danh mục</p>

        <div className="form-grid">
          {/* Icon */}
          <div className="form-group">
            <label>
              Biểu tượng
              <span className="tooltip" title="Emoji hiển thị cùng tên danh mục">?</span>
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
                placeholder="Hoặc nhập emoji tùy chỉnh"
                className="custom-icon-input"
              />
            </div>
          </div>

          {/* Color */}
          <div className="form-group">
            <label>
              Màu chủ đề
              <span className="tooltip" title="Màu chính cho giao diện danh mục">?</span>
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
                Đã chọn: <span className="color-name">{COLOR_PRESETS.find(c => c.value === selectedColor)?.label || selectedColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Cài đặt SEO</h2>
        <p className="section-desc">Tối ưu hóa công cụ tìm kiếm cho trang danh mục</p>

        <div className="seo-actions">
          <button type="button" className="btn-generate" onClick={generateSeoFields}>
            Tự động tạo thông tin SEO
          </button>
        </div>

        <div className="form-grid">
          {/* Meta Title */}
          <div className="form-group full-width">
            <label htmlFor="metaTitle">
              Tiêu đề Meta
              <span className="tooltip" title="Tiêu đề hiển thị trên kết quả tìm kiếm (50-60 ký tự)">?</span>
            </label>
            <input
              id="metaTitle"
              type="text"
              {...register('metaTitle')}
              placeholder="Top 10 [Danh mục] tốt nhất 2026 - So sánh | Top10"
            />
            <div className="char-count">
              {(watch('metaTitle') || '').length} / 60 ký tự
            </div>
          </div>

          {/* Meta Description */}
          <div className="form-group full-width">
            <label htmlFor="metaDescription">
              Mô tả Meta
              <span className="tooltip" title="Mô tả trong kết quả tìm kiếm (150-160 ký tự)">?</span>
            </label>
            <textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="Mô tả hấp dẫn cho công cụ tìm kiếm..."
              rows={3}
            />
            <div className="char-count">
              {(watch('metaDescription') || '').length} / 160 ký tự
            </div>
          </div>

          {/* OG Image */}
          <div className="form-group full-width">
            <ImageUpload
              label="Ảnh OG (Mạng xã hội)"
              value={watch('ogImage') || ''}
              onChange={(url) => setValue('ogImage', url, { shouldDirty: true })}
              placeholder="Tải lên hoặc nhập URL ảnh để chia sẻ mạng xã hội"
              folder="categories/og"
            />
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

        .help-text {
          font-size: 12px;
          color: #9ca3af;
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
