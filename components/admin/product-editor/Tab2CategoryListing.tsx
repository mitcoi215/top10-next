'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData, FeatureItem } from './types';

export default function Tab2CategoryListing() {
  const { register, watch, setValue, control, formState: { errors } } = useFormContext<ProductFormData>();

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  const quote = watch('quote');

  const addFeature = () => {
    appendFeature({ text: '', bold: false });
  };

  const toggleQuote = () => {
    if (quote) {
      setValue('quote', null);
    } else {
      setValue('quote', { text: '', source: '', date: '' });
    }
  };

  return (
    <div className="tab-category-listing">
      <div className="section">
        <h2 className="section-title">Xếp hạng & Hiển thị</h2>
        <p className="section-desc">Cách sản phẩm này hiển thị trong danh sách top 10</p>

        <div className="form-grid">
          {/* Rank */}
          <div className="form-group">
            <label htmlFor="rank">
              Vị trí xếp hạng <span className="required">*</span>
              <span className="tooltip" title="Vị trí trong danh sách top 10 (1-10)">?</span>
            </label>
            <input
              id="rank"
              type="number"
              min="1"
              max="10"
              {...register('rank', {
                required: 'Xếp hạng là bắt buộc',
                min: { value: 1, message: 'Xếp hạng tối thiểu là 1' },
                max: { value: 10, message: 'Xếp hạng tối đa là 10' }
              })}
              className={errors.rank ? 'error' : ''}
            />
            {errors.rank && <span className="error-msg">{errors.rank.message}</span>}
          </div>

          {/* Ribbon */}
          <div className="form-group">
            <label htmlFor="ribbon">
              Huy hiệu
              <span className="tooltip" title="Huy hiệu đặc biệt như 'Tốt nhất', 'Lựa chọn biên tập'">?</span>
            </label>
            <select id="ribbon" {...register('ribbon')}>
              <option value="">Không có huy hiệu</option>
              <option value="Best Overall">Tốt nhất tổng thể</option>
              <option value="Editor's Choice">Lựa chọn biên tập</option>
              <option value="Best Value">Giá trị tốt nhất</option>
              <option value="Most Popular">Phổ biến nhất</option>
              <option value="Rising Star">Ngôi sao mới</option>
            </select>
          </div>

          {/* Tagline */}
          <div className="form-group full-width">
            <label htmlFor="tagline">
              Khẩu hiệu
              <span className="tooltip" title="Cụm từ ngắn hấp dẫn dưới tên sản phẩm">?</span>
            </label>
            <input
              id="tagline"
              type="text"
              {...register('tagline')}
              placeholder="VD: Tự do tạo gói tùy chỉnh"
            />
          </div>

          {/* Bottom Line */}
          <div className="form-group full-width">
            <label htmlFor="bottomLine">
              Tóm tắt
              <span className="tooltip" title="Mô tả dài hơn hiển thị trong thẻ so sánh">?</span>
            </label>
            <textarea
              id="bottomLine"
              {...register('bottomLine')}
              placeholder="Mô tả ngắn về sản phẩm..."
              rows={3}
            />
          </div>

          {/* Best For */}
          <div className="form-group">
            <label htmlFor="bestFor">
              Phù hợp cho
              <span className="tooltip" title="Đối tượng mục tiêu hoặc trường hợp sử dụng">?</span>
            </label>
            <input
              id="bestFor"
              type="text"
              {...register('bestFor')}
              placeholder="VD: Người dùng quan tâm ngân sách"
            />
          </div>

          {/* Base Price */}
          <div className="form-group">
            <label htmlFor="basePrice">
              Giá khởi điểm
              <span className="tooltip" title="Giá cơ bản hoặc phạm vi giá">?</span>
            </label>
            <input
              id="basePrice"
              type="text"
              {...register('basePrice')}
              placeholder="VD: 40$/tháng, Miễn phí, $19.99"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Điểm số & Đánh giá</h2>
        <p className="section-desc">Điểm biên tập cho sản phẩm này</p>

        <div className="form-grid">
          {/* Overall Score */}
          <div className="form-group">
            <label htmlFor="overallScore">
              Điểm tổng thể
              <span className="tooltip" title="Điểm chính trên 10 (dùng để sắp xếp)">?</span>
            </label>
            <input
              id="overallScore"
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...register('overallScore', { valueAsNumber: true })}
              placeholder="VD: 9.2"
            />
          </div>

          {/* Score Label */}
          <div className="form-group">
            <label htmlFor="scoreLabel">
              Nhãn điểm
              <span className="tooltip" title="Nhãn văn bản cho điểm số">?</span>
            </label>
            <select id="scoreLabel" {...register('scoreLabel')}>
              <option value="">Chọn nhãn...</option>
              <option value="Excellent">Xuất sắc (9.0+)</option>
              <option value="Very Good">Rất tốt (8.0-8.9)</option>
              <option value="Good">Tốt (7.0-7.9)</option>
              <option value="Fair">Khá (6.0-6.9)</option>
              <option value="Poor">Kém (&lt;6.0)</option>
            </select>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="scores-section">
          <h3>Điểm chi tiết (Theo danh mục)</h3>
          <p className="hint">Các điểm này được xác định bởi tiêu chí danh mục</p>
          <div className="scores-grid">
            {['Value', 'Features', 'Ease of Use', 'Support', 'Quality'].map((criterion) => (
              <div key={criterion} className="score-item">
                <label>{criterion}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="0-10"
                  onChange={(e) => {
                    const currentScores = watch('scores') || {};
                    setValue('scores', {
                      ...currentScores,
                      [criterion.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0
                    });
                  }}
                  defaultValue={watch('scores')?.[criterion.toLowerCase().replace(/ /g, '_')] || ''}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Thông tin nổi bật</h2>
        <p className="section-desc">Thông tin chính hiển thị nổi bật (tối đa 3 mục)</p>

        <div className="highlights-grid">
          {['Starting Price', 'Trial Period', 'Best For'].map((label) => (
            <div key={label} className="highlight-item">
              <label>{label}</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}...`}
                onChange={(e) => {
                  const currentHighlights = watch('highlights') || {};
                  setValue('highlights', {
                    ...currentHighlights,
                    [label.toLowerCase().replace(/ /g, '_')]: e.target.value
                  });
                }}
                defaultValue={watch('highlights')?.[label.toLowerCase().replace(/ /g, '_')] || ''}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Danh sách tính năng</h2>
        <p className="section-desc">Các tính năng chính hiển thị trong thẻ so sánh (dấu tick)</p>

        <div className="features-list">
          {featureFields.map((field, index) => (
            <div key={field.id} className="feature-item">
              <input
                type="text"
                {...register(`features.${index}.text` as const)}
                placeholder="Nhập tính năng..."
              />
              <label className="bold-checkbox">
                <input
                  type="checkbox"
                  {...register(`features.${index}.bold` as const)}
                />
                Đậm
              </label>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeFeature(index)}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addFeature}>
            + Thêm tính năng
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Trích dẫn khách hàng</h2>
        <p className="section-desc">Phản hồi hiển thị trong thẻ sản phẩm</p>

        <div className="quote-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={!!quote}
              onChange={toggleQuote}
            />
            Bao gồm trích dẫn khách hàng
          </label>
        </div>

        {quote && (
          <div className="quote-fields">
            <div className="form-group full-width">
              <label>Nội dung trích dẫn</label>
              <textarea
                value={quote.text}
                onChange={(e) => setValue('quote', { ...quote, text: e.target.value })}
                placeholder="Nhập trích dẫn khách hàng..."
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Tên nguồn</label>
              <input
                type="text"
                value={quote.source}
                onChange={(e) => setValue('quote', { ...quote, source: e.target.value })}
                placeholder="VD: Nguyễn Văn A."
              />
            </div>
            <div className="form-group">
              <label>Ngày</label>
              <input
                type="text"
                value={quote.date}
                onChange={(e) => setValue('quote', { ...quote, date: e.target.value })}
                placeholder="VD: Tháng 1, 2026"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-category-listing {
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
        }

        input, select, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .error-msg {
          font-size: 12px;
          color: #dc2626;
        }

        .hint {
          font-size: 13px;
          color: #9ca3af;
          margin: 0 0 12px 0;
        }

        .scores-section {
          margin-top: 20px;
        }

        .scores-section h3 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .scores-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .score-item label {
          font-size: 12px;
          color: #6b7280;
        }

        .score-item input {
          padding: 8px;
          text-align: center;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .highlight-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .highlight-item label {
          font-size: 13px;
          color: #6b7280;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .feature-item input[type="text"] {
          flex: 1;
        }

        .bold-checkbox {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
        }

        .bold-checkbox input {
          width: 16px;
          height: 16px;
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
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 10px 16px;
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

        .quote-toggle {
          margin-bottom: 16px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .toggle-label input {
          width: 18px;
          height: 18px;
        }

        .quote-fields {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .form-grid,
          .scores-grid,
          .highlights-grid,
          .quote-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
