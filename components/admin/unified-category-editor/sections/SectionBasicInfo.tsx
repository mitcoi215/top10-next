'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData, ICON_PRESETS, COLOR_PRESETS } from '../types';

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
}

interface SectionBasicInfoProps {
  categoryGroups: CategoryGroup[];
}

export default function SectionBasicInfo({ categoryGroups }: SectionBasicInfoProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CategoryFormData>();

  const name = watch('name');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

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

  return (
    <div className="form-grid">
      {/* Name */}
      <div className="form-group">
        <label className="form-label">
          Tên danh mục <span className="required">*</span>
        </label>
        <input
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          {...register('name', { required: 'Tên danh mục là bắt buộc' })}
          placeholder="VD: Dịch vụ TV, Dating, VPN"
        />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>

      {/* Slug */}
      <div className="form-group">
        <label className="form-label">
          URL Slug <span className="required">*</span>
        </label>
        <div className="input-with-btn">
          <input
            type="text"
            className={`form-input ${errors.slug ? 'error' : ''}`}
            {...register('slug', {
              required: 'Slug là bắt buộc',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Chỉ chữ thường, số và gạch ngang'
              }
            })}
            placeholder="VD: dich-vu-tv"
          />
          <button type="button" className="btn-auto" onClick={generateSlug}>
            Tạo tự động
          </button>
        </div>
        {errors.slug && <span className="form-error">{errors.slug.message}</span>}
      </div>

      {/* Category Group */}
      <div className="form-group">
        <label className="form-label">Nhóm danh mục</label>
        <select className="form-select" {...register('groupId')}>
          <option value="">-- Không thuộc nhóm nào --</option>
          {categoryGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <span className="form-hint">Hiển thị trong Hero Section trang chủ</span>
      </div>

      {/* Icon Picker */}
      <div className="form-group">
        <label className="form-label">Biểu tượng</label>
        <div className="icon-picker">
          <div className="icon-current">{selectedIcon || '📁'}</div>
          <div className="icon-grid">
            {ICON_PRESETS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`icon-btn ${selectedIcon === icon ? 'selected' : ''}`}
                onClick={() => setValue('icon', icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            type="text"
            className="form-input icon-custom"
            {...register('icon')}
            placeholder="Hoặc nhập emoji tùy chỉnh"
          />
        </div>
      </div>

      {/* Color Picker */}
      <div className="form-group full-width">
        <label className="form-label">Màu chủ đề</label>
        <div className="color-picker">
          <div className="color-grid">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`color-btn ${selectedColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setValue('color', color.value)}
                title={color.label}
              />
            ))}
          </div>
          <span className="color-label">
            Đã chọn: <strong>{COLOR_PRESETS.find(c => c.value === selectedColor)?.label || 'Xanh dương'}</strong>
          </span>
        </div>
      </div>

      {/* Featured & Order */}
      <div className="form-group">
        <label className="form-label">Thứ tự hiển thị</label>
        <input
          type="number"
          className="form-input"
          {...register('order', { valueAsNumber: true })}
          placeholder="0"
          min="0"
        />
        <span className="form-hint">Số nhỏ hơn hiển thị trước</span>
      </div>

      <div className="form-group">
        <label className="form-label">Đánh dấu nổi bật</label>
        <div className="checkbox-wrapper">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register('featured')}
            />
            <span className="checkbox-text">Danh mục nổi bật</span>
          </label>
          <span className="form-hint">Hiển thị ở trang chủ và các vị trí nổi bật</span>
        </div>
      </div>

      <style jsx>{`
        .icon-picker {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .icon-current {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 24px;
        }

        .icon-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .icon-btn:hover {
          border-color: #d1d5db;
          background: white;
        }

        .icon-btn.selected {
          border-color: #FE4A64;
          background: #fff5f6;
        }

        .icon-custom {
          max-width: 200px;
        }

        .color-picker {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .color-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .color-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }

        .color-btn:hover {
          transform: scale(1.15);
        }

        .color-btn.selected {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #1a1a1a;
        }

        .color-label {
          font-size: 13px;
          color: #6b7280;
        }

        .color-label strong {
          color: #374151;
        }

        .checkbox-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #FE4A64;
          cursor: pointer;
        }

        .checkbox-text {
          color: #374151;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
