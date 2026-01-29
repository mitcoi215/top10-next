'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from './types';
import dynamic from 'next/dynamic';
import ImageUpload from '../category-editor/ImageUpload';

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('../RichTextEditor'), {
  ssr: false,
  loading: () => <div className="editor-loading">Loading editor...</div>,
});

// Dynamic import for HtmlRichTextEditor (outputs HTML for heroSummary)
const HtmlRichTextEditor = dynamic(() => import('../HtmlRichTextEditor'), {
  ssr: false,
  loading: () => <div className="editor-loading">Loading editor...</div>,
});

export default function Tab3ReviewContent() {
  const { register, watch, setValue, control } = useFormContext<ProductFormData>();

  const { fields: prosFields, append: appendPro, remove: removePro } = useFieldArray({
    control,
    name: 'pros' as never,
  });

  const { fields: consFields, append: appendCon, remove: removeCon } = useFieldArray({
    control,
    name: 'cons' as never,
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images' as never,
  });

  const pros = watch('pros') || [];
  const cons = watch('cons') || [];
  const images = watch('images') || [];

  return (
    <div className="tab-review-content">
      <div className="section">
        <h2 className="section-title">Tiêu đề đánh giá</h2>
        <p className="section-desc">Tiêu đề và giới thiệu hiển thị ở đầu trang đánh giá</p>

        <div className="form-grid">
          {/* Review Title */}
          <div className="form-group full-width">
            <label htmlFor="reviewTitle">
              Tiêu đề đánh giá
              <span className="tooltip" title="Tiêu đề chính cho trang đánh giá">?</span>
            </label>
            <input
              id="reviewTitle"
              type="text"
              {...register('reviewTitle')}
              placeholder="VD: Đánh giá Sling TV 2026: Có đáng dùng không?"
            />
          </div>

          {/* Review Subtitle */}
          <div className="form-group full-width">
            <label htmlFor="reviewSubtitle">
              Phụ đề
              <span className="tooltip" title="Tiêu đề phụ dưới tiêu đề chính">?</span>
            </label>
            <input
              id="reviewSubtitle"
              type="text"
              {...register('reviewSubtitle')}
              placeholder="VD: Một lựa chọn streaming TV linh hoạt"
            />
          </div>

          {/* Hero Image with Upload */}
          <div className="form-group">
            <ImageUpload
              value={watch('reviewHeroImage') || ''}
              onChange={(url) => setValue('reviewHeroImage', url)}
              label="URL ảnh Banner"
              placeholder="Nhập URL hoặc upload ảnh banner"
              folder="products/banners"
            />
          </div>

          {/* Rating & Review Count */}
          <div className="form-group">
            <label htmlFor="rating">
              Đánh giá người dùng
              <span className="tooltip" title="Điểm đánh giá trung bình (1-5 sao)">?</span>
            </label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="1"
              max="5"
              {...register('rating', { valueAsNumber: true })}
              placeholder="VD: 4.2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reviewCount">
              Số lượt đánh giá
              <span className="tooltip" title="Số lượng đánh giá từ người dùng">?</span>
            </label>
            <input
              id="reviewCount"
              type="text"
              {...register('reviewCount')}
              placeholder="VD: 3,598 đánh giá"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Tóm tắt Banner</h2>
        <p className="section-desc">Đoạn mở đầu tóm tắt đánh giá (hiển thị trong phần mini-review)</p>

        <div className="form-group editor-wrapper-bordered">
          <HtmlRichTextEditor
            value={watch('heroSummary') || ''}
            onChange={(html) => setValue('heroSummary', html)}
            placeholder="Viết một đoạn giới thiệu hấp dẫn cho người đọc cái nhìn tổng quan nhanh về sản phẩm này..."
            minHeight="150px"
            maxHeight="300px"
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Video</h2>
        <p className="section-desc">Nhúng video từ YouTube, Vimeo, Dailymotion, v.v.</p>

        <div className="form-group">
          <label htmlFor="videoUrl">
            URL Video
            <span className="tooltip" title="URL đầy đủ đến video (YouTube, Vimeo, Dailymotion)">?</span>
          </label>
          <input
            id="videoUrl"
            type="text"
            {...register('videoUrl')}
            placeholder="VD: https://www.youtube.com/watch?v=iX7JdbHNKBE"
          />
          <span className="helper-text">
            Hỗ trợ: YouTube, Vimeo, Dailymotion, hoặc URL nhúng trực tiếp
          </span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Ưu & Nhược điểm</h2>
        <p className="section-desc">Ưu điểm và nhược điểm chính</p>

        <div className="pros-cons-grid">
          {/* Pros */}
          <div className="pros-section">
            <h3 className="list-title pros-title">👍 Ưu điểm</h3>
            <div className="list-items">
              {pros.map((_, index) => (
                <div key={index} className="list-item">
                  <input
                    type="text"
                    {...register(`pros.${index}` as const)}
                    placeholder="Nhập ưu điểm..."
                  />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => {
                      const newPros = [...pros];
                      newPros.splice(index, 1);
                      setValue('pros', newPros);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() => setValue('pros', [...pros, ''])}
              >
                + Thêm ưu điểm
              </button>
            </div>
          </div>

          {/* Cons */}
          <div className="cons-section">
            <h3 className="list-title cons-title">👎 Nhược điểm</h3>
            <div className="list-items">
              {cons.map((_, index) => (
                <div key={index} className="list-item">
                  <input
                    type="text"
                    {...register(`cons.${index}` as const)}
                    placeholder="Nhập nhược điểm..."
                  />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => {
                      const newCons = [...cons];
                      newCons.splice(index, 1);
                      setValue('cons', newCons);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() => setValue('cons', [...cons, ''])}
              >
                + Thêm nhược điểm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Nội dung chính</h2>
        <p className="section-desc">Nội dung đánh giá đầy đủ với định dạng văn bản phong phú</p>

        <div className="editor-wrapper">
          <RichTextEditor
            value={watch('mainContent') || ''}
            onChange={(content) => setValue('mainContent', content)}
            placeholder="Viết đánh giá chi tiết của bạn tại đây..."
            minHeight="400px"
            maxHeight="600px"
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Kết luận</h2>
        <p className="section-desc">Kết luận cuối cùng và khuyến nghị</p>

        <div className="form-group">
          <textarea
            {...register('verdict')}
            placeholder="Viết kết luận và khuyến nghị cuối cùng..."
            rows={4}
          />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Thư viện ảnh</h2>
        <p className="section-desc">Các ảnh bổ sung cho đánh giá</p>

        <div className="images-list">
          {images.map((_, index) => (
            <div key={index} className="image-item">
              <input
                type="text"
                {...register(`images.${index}` as const)}
                placeholder="URL ảnh..."
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setValue('images', newImages);
                }}
              >
                ×
              </button>
              {images[index] && (
                <div className="image-thumb">
                  <img src={images[index]} alt={`Image ${index + 1}`} />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => setValue('images', [...images, ''])}
          >
            + Thêm ảnh
          </button>
        </div>
      </div>

      <style jsx>{`
        .tab-review-content {
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

        .helper-text {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
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

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 4px;
        }

        .pros-cons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .list-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .pros-title {
          background: #d1fae5;
          color: #065f46;
        }

        .cons-title {
          background: #fee2e2;
          color: #991b1b;
        }

        .list-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .list-item {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .list-item input {
          flex: 1;
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
          flex-shrink: 0;
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

        .editor-wrapper {
          min-height: 400px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
        }

        .editor-wrapper-bordered {
          border-radius: 8px;
          overflow: hidden;
        }

        .editor-loading {
          padding: 40px;
          text-align: center;
          color: #6b7280;
        }

        .images-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .image-item {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: flex-start;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .image-item input {
          flex: 1;
          min-width: 200px;
        }

        .image-thumb {
          width: 100%;
          margin-top: 8px;
        }

        .image-thumb img {
          max-width: 200px;
          max-height: 100px;
          object-fit: contain;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .form-grid,
          .pros-cons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
