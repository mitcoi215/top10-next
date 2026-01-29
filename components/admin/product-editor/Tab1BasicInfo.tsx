'use client';

import { useFormContext } from 'react-hook-form';
import { ProductFormData, CategoryOption, AuthorOption } from './types';
import ImageUpload from '../category-editor/ImageUpload';

interface Tab1Props {
  categories: CategoryOption[];
  authors: AuthorOption[];
}

export default function Tab1BasicInfo({ categories, authors }: Tab1Props) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ProductFormData>();

  const name = watch('name');

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

  // Auto-generate review href
  const generateReviewHref = () => {
    const categoryId = watch('categoryId');
    const slug = watch('slug');
    const category = categories.find(c => c.id === categoryId);
    if (category && slug) {
      setValue('reviewHref', `/${category.slug}/reviews/${slug}`);
    }
  };

  return (
    <div className="tab-basic-info">
      <div className="section">
        <h2 className="section-title">Thông tin cơ bản</h2>
        <p className="section-desc">Cài đặt nhận dạng và hiển thị sản phẩm cốt lõi</p>

        <div className="form-grid">
          {/* Name */}
          <div className="form-group full-width">
            <label htmlFor="name">
              Tên sản phẩm <span className="required">*</span>
              <span className="tooltip" title="Tên hiển thị của sản phẩm/dịch vụ">?</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
              placeholder="VD: Sling TV, eharmony"
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
                placeholder="VD: sling-tv"
                className={errors.slug ? 'error' : ''}
              />
              <button type="button" className="btn-gen" onClick={generateSlug}>
                Tạo tự động
              </button>
            </div>
            {errors.slug && <span className="error-msg">{errors.slug.message}</span>}
          </div>

          {/* Logo URL with Upload */}
          <div className="form-group">
            <ImageUpload
              value={watch('logoUrl') || ''}
              onChange={(url) => setValue('logoUrl', url)}
              label="URL Logo"
              placeholder="Nhập URL hoặc upload ảnh logo"
              folder="products/logos"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Danh mục & Tác giả</h2>
        <p className="section-desc">Gán sản phẩm vào danh mục và tác giả</p>

        <div className="form-grid">
          {/* Category */}
          <div className="form-group">
            <label htmlFor="categoryId">
              Danh mục <span className="required">*</span>
            </label>
            <select
              id="categoryId"
              {...register('categoryId', { required: 'Danh mục là bắt buộc' })}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">Chọn danh mục...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="error-msg">{errors.categoryId.message}</span>}
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="authorId">
              Tác giả
              <span className="tooltip" title="Người viết bài đánh giá sản phẩm này">?</span>
            </label>
            <select id="authorId" {...register('authorId')}>
              <option value="">Chọn tác giả...</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Liên kết & CTA</h2>
        <p className="section-desc">Liên kết tiếp thị và điều hướng</p>

        <div className="form-grid">
          {/* CTA URL (Affiliate) */}
          <div className="form-group">
            <label htmlFor="ctaUrl">
              URL Affiliate
              <span className="tooltip" title="Liên kết affiliate/giới thiệu cho sản phẩm này">?</span>
            </label>
            <input
              id="ctaUrl"
              type="url"
              {...register('ctaUrl')}
              placeholder="https://affiliate.example.com/..."
            />
          </div>

          {/* CTA Text */}
          <div className="form-group">
            <label htmlFor="ctaText">
              Văn bản nút CTA
              <span className="tooltip" title="Văn bản hiển thị trên nút kêu gọi hành động">?</span>
            </label>
            <input
              id="ctaText"
              type="text"
              {...register('ctaText')}
              placeholder="Xem trang web"
            />
          </div>

          {/* Review Href */}
          <div className="form-group full-width">
            <label htmlFor="reviewHref">
              URL trang đánh giá
              <span className="tooltip" title="Liên kết nội bộ đến trang đánh giá chi tiết">?</span>
            </label>
            <div className="input-with-btn">
              <input
                id="reviewHref"
                type="text"
                {...register('reviewHref')}
                placeholder="/tv-services/reviews/sling-tv"
              />
              <button type="button" className="btn-gen" onClick={generateReviewHref}>
                Tạo tự động
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Trạng thái</h2>
        <p className="section-desc">Trạng thái xuất bản của sản phẩm này</p>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="status">Trạng thái xuất bản</label>
            <div className="status-toggle">
              <label className={`toggle-option ${watch('status') === 'draft' ? 'active' : ''}`}>
                <input
                  type="radio"
                  {...register('status')}
                  value="draft"
                />
                <span className="toggle-icon">📝</span>
                Bản nháp
              </label>
              <label className={`toggle-option ${watch('status') === 'published' ? 'active' : ''}`}>
                <input
                  type="radio"
                  {...register('status')}
                  value="published"
                />
                <span className="toggle-icon">✅</span>
                Đã xuất bản
              </label>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tab-basic-info {
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

        .required {
          color: #dc2626;
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

        input, select {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus, select:focus {
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

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          text-align: center;
        }

        .image-preview img {
          max-width: 150px;
          max-height: 80px;
          object-fit: contain;
        }

        .status-toggle {
          display: flex;
          gap: 12px;
        }

        .toggle-option {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-option:hover {
          border-color: #d1d5db;
        }

        .toggle-option.active {
          border-color: #FE4A64;
          background: #fff5f6;
        }

        .toggle-option input {
          display: none;
        }

        .toggle-icon {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
}
