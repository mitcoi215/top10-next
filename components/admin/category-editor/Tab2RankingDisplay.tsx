'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData, AuthorOption } from './types';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

interface Tab2Props {
  authors: AuthorOption[];
}

export default function Tab2RankingDisplay({ authors }: Tab2Props) {
  const { register, watch, setValue } = useFormContext<CategoryFormData>();

  return (
    <div className="tab-ranking-display">
      <div className="section">
        <h2 className="section-title">Phần Banner</h2>
        <p className="section-desc">Nội dung banner của trang danh mục</p>

        <div className="form-grid">
          {/* Hero Image */}
          <div className="form-group full-width">
            <ImageUpload
              label="Ảnh Banner"
              value={watch('heroImage') || ''}
              onChange={(url) => setValue('heroImage', url, { shouldDirty: true })}
              placeholder="Tải lên hoặc nhập URL ảnh banner"
              folder="categories/hero"
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="authorId">
              Tác giả danh mục
              <span className="tooltip" title="Tác giả hiển thị ở đầu trang danh mục">?</span>
            </label>
            <select
              id="authorId"
              value={watch('authorId') || ''}
              onChange={(e) => setValue('authorId', e.target.value, { shouldDirty: true })}
              className="author-select"
            >
              <option value="">-- Chọn tác giả --</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} {author.title ? `(${author.title})` : ''}
                </option>
              ))}
            </select>
            {watch('authorId') && (
              <div className="selected-author">
                {(() => {
                  const selected = authors.find(a => a.id === watch('authorId'));
                  return selected ? (
                    <div className="author-preview">
                      {selected.avatar && <img src={selected.avatar} alt={selected.name} />}
                      <div>
                        <strong>{selected.name}</strong>
                        {selected.title && <span>{selected.title}</span>}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Hero Title */}
          <div className="form-group full-width">
            <label htmlFor="heroTitle">
              Tiêu đề Banner
              <span className="tooltip" title="Tiêu đề chính hiển thị trên ảnh banner">?</span>
            </label>
            <input
              id="heroTitle"
              type="text"
              {...register('heroTitle')}
              placeholder="VD: Top 10 dịch vụ streaming tốt nhất 2026"
            />
          </div>

          {/* Intro Content */}
          <div className="form-group full-width">
            <RichTextEditor
              label="Nội dung giới thiệu"
              value={watch('introContent') || ''}
              onChange={(value) => setValue('introContent', value, { shouldDirty: true })}
              placeholder="Viết phần giới thiệu danh mục tại đây..."
            />
            <div className="hint">Nội dung này xuất hiện bên dưới phần banner trên trang danh mục.</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tab-ranking-display {
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
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .author-select {
          width: 100%;
        }

        .selected-author {
          margin-top: 8px;
        }

        .author-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #f9fafb;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .author-preview img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-preview div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-preview strong {
          font-size: 14px;
          color: #374151;
        }

        .author-preview span {
          font-size: 12px;
          color: #6b7280;
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .image-preview {
          margin-top: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 150px;
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
