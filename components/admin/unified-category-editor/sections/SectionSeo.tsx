'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData } from '../types';
import ImageUpload from '../../category-editor/ImageUpload';

export default function SectionSeo() {
  const { register, watch, setValue } = useFormContext<CategoryFormData>();

  const name = watch('name');

  // Auto-generate SEO fields
  const generateSeoFields = () => {
    if (name) {
      setValue('metaTitle', `Top 10 ${name} tốt nhất 2026 - So sánh & Đánh giá | 10rating`);
      setValue('metaDescription', `So sánh ${name.toLowerCase()} tốt nhất 2026. Đánh giá chi tiết, so sánh tính năng và giá cả để tìm lựa chọn phù hợp nhất.`);
    }
  };

  return (
    <div className="seo-section">
      <div className="seo-actions">
        <button type="button" className="btn-generate" onClick={generateSeoFields}>
          🪄 Tự động tạo thông tin SEO
        </button>
      </div>

      <div className="form-grid">
        {/* Meta Title */}
        <div className="form-group full-width">
          <label className="form-label">Tiêu đề Meta</label>
          <input
            type="text"
            className="form-input"
            {...register('metaTitle')}
            placeholder="Top 10 [Danh mục] tốt nhất 2026 - So sánh | 10rating"
          />
          <div className="char-count">
            {(watch('metaTitle') || '').length} / 60 ký tự
          </div>
        </div>

        {/* Meta Description */}
        <div className="form-group full-width">
          <label className="form-label">Mô tả Meta</label>
          <textarea
            className="form-textarea"
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
            placeholder="Tải lên hoặc nhập URL ảnh chia sẻ mạng xã hội"
            folder="categories/og"
          />
        </div>
      </div>

      {/* SEO Preview */}
      <div className="seo-preview">
        <h4>Xem trước kết quả tìm kiếm</h4>
        <div className="preview-card">
          <div className="preview-url">10rating.com › {watch('slug') || 'category'}</div>
          <div className="preview-title">
            {watch('metaTitle') || 'Tiêu đề danh mục | 10rating'}
          </div>
          <div className="preview-desc">
            {watch('metaDescription') || 'Mô tả meta sẽ hiển thị ở đây...'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .seo-section {
          margin-top: 20px;
        }

        .seo-actions {
          margin-bottom: 20px;
        }

        .btn-generate {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-generate:hover {
          opacity: 0.9;
        }

        .seo-preview {
          margin-top: 24px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
        }

        .seo-preview h4 {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .preview-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .preview-url {
          font-size: 12px;
          color: #059669;
          margin-bottom: 4px;
        }

        .preview-title {
          font-size: 18px;
          color: #1a0dab;
          font-weight: 500;
          margin-bottom: 4px;
          cursor: pointer;
        }

        .preview-title:hover {
          text-decoration: underline;
        }

        .preview-desc {
          font-size: 14px;
          color: #4d5156;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
