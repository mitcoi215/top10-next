'use client';

import { useFormContext } from 'react-hook-form';
import { ProductFormData, FaqItem } from './types';
import ImageUpload from '../category-editor/ImageUpload';

export default function Tab4FaqSeo() {
  const { register, watch, setValue } = useFormContext<ProductFormData>();

  const faqs = watch('faqs') || [];
  const name = watch('name');
  const reviewTitle = watch('reviewTitle');

  const addFaq = () => {
    setValue('faqs', [...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setValue('faqs', newFaqs);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setValue('faqs', newFaqs);
  };

  // Auto-generate SEO fields
  const generateSeoFields = () => {
    const title = reviewTitle || `${name} Review 2026`;
    setValue('metaTitle', `${title} | Top10`);
    setValue('metaDescription', `Read our in-depth ${name} review. Compare features, pricing, pros & cons to find out if ${name} is right for you.`);
  };

  return (
    <div className="tab-faq-seo">
      <div className="section">
        <h2 className="section-title">Câu hỏi thường gặp</h2>
        <p className="section-desc">Phần FAQ cho trang đánh giá sản phẩm (hỗ trợ SEO)</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-header">
                <span className="faq-number">Q{index + 1}</span>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeFaq(index)}
                >
                  ×
                </button>
              </div>
              <div className="faq-fields">
                <div className="form-group">
                  <label>Câu hỏi</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="VD: Giá của Sling TV là bao nhiêu?"
                  />
                </div>
                <div className="form-group">
                  <label>Câu trả lời</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Cung cấp câu trả lời chi tiết..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn-add" onClick={addFaq}>
            + Thêm câu hỏi
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Cài đặt SEO</h2>
        <p className="section-desc">Thông tin tối ưu hóa công cụ tìm kiếm</p>

        <div className="seo-actions">
          <button type="button" className="btn-generate" onClick={generateSeoFields}>
            🪄 Tự động tạo thông tin SEO
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
              placeholder="VD: Đánh giá Sling TV 2026: Tính năng, Giá & Hơn thế | Top10"
            />
            <div className="char-count">
              {(watch('metaTitle') || '').length} / 60 ký tự
            </div>
          </div>

          {/* Meta Description */}
          <div className="form-group full-width">
            <label htmlFor="metaDescription">
              Mô tả Meta
              <span className="tooltip" title="Mô tả hiển thị trên kết quả tìm kiếm (150-160 ký tự)">?</span>
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
          <div className="form-group">
            <ImageUpload
              value={watch('ogImage') || ''}
              onChange={(url) => setValue('ogImage', url)}
              label="Ảnh OG (Social Share)"
              placeholder="Nhập URL hoặc upload ảnh OG"
              folder="products/og"
            />
          </div>

          {/* Canonical URL */}
          <div className="form-group">
            <label htmlFor="canonical">
              URL Canonical
              <span className="tooltip" title="URL gốc nếu nội dung tồn tại ở nơi khác">?</span>
            </label>
            <input
              id="canonical"
              type="text"
              {...register('canonical')}
              placeholder="https://example.com/noi-dung-goc"
            />
          </div>
        </div>

        {/* SEO Preview */}
        <div className="seo-preview">
          <h3>Xem trước kết quả tìm kiếm</h3>
          <div className="preview-card">
            <div className="preview-url">
              10rating › {watch('reviewHref') || 'product-review'}
            </div>
            <div className="preview-title">
              {watch('metaTitle') || 'Tiêu đề sản phẩm | Top10'}
            </div>
            <div className="preview-desc">
              {watch('metaDescription') || 'Mô tả meta sẽ hiển thị ở đây...'}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Sản phẩm liên quan</h2>
        <p className="section-desc">Sản phẩm hiển thị trong phần "Liên quan"</p>

        <div className="form-group">
          <label>
            ID sản phẩm liên quan
            <span className="tooltip" title="ID sản phẩm phân cách bằng dấu phẩy">?</span>
          </label>
          <input
            type="text"
            value={(watch('relatedProductIds') || []).join(', ')}
            onChange={(e) => {
              const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
              setValue('relatedProductIds', ids);
            }}
            placeholder="id-san-pham-1, id-san-pham-2, id-san-pham-3"
          />
          <p className="hint">Nhập ID sản phẩm phân cách bằng dấu phẩy</p>
        </div>
      </div>

      <style jsx>{`
        .tab-faq-seo {
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
        }

        input, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
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
          margin: 0;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .faq-number {
          font-size: 14px;
          font-weight: 600;
          color: #FE4A64;
          background: #fff5f6;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .faq-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-remove {
          width: 32px;
          height: 32px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 12px 16px;
          background: #f3f4f6;
          border: 1px dashed #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
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

        .og-preview {
          margin-top: 8px;
        }

        .og-preview img {
          max-width: 200px;
          max-height: 100px;
          object-fit: contain;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .seo-preview {
          margin-top: 24px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .seo-preview h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .preview-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
          line-height: 1.4;
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
