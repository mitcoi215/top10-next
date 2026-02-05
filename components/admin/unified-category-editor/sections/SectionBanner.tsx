'use client';

import { useFormContext } from 'react-hook-form';
import { CategoryFormData } from '../types';
import ImageUpload from '../../category-editor/ImageUpload';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../category-editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

interface Author {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

interface SectionBannerProps {
  authors: Author[];
}

export default function SectionBanner({ authors }: SectionBannerProps) {
  const { register, watch, setValue } = useFormContext<CategoryFormData>();

  const selectedAuthorId = watch('authorId');
  const selectedAuthor = authors.find(a => a.id === selectedAuthorId);

  return (
    <div className="banner-section">
      <div className="form-grid">
        {/* Hero Image */}
        <div className="form-group full-width">
          <ImageUpload
            label="Ảnh Banner"
            value={watch('heroImage') || ''}
            onChange={(url) => setValue('heroImage', url, { shouldDirty: true })}
            placeholder="Tải lên hoặc nhập URL ảnh banner trang danh mục"
            folder="categories/hero"
          />
        </div>

        {/* Author */}
        <div className="form-group">
          <label className="form-label">Tác giả danh mục</label>
          <select
            className="form-select"
            value={selectedAuthorId || ''}
            onChange={(e) => setValue('authorId', e.target.value, { shouldDirty: true })}
          >
            <option value="">-- Chọn tác giả --</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} {author.title ? `(${author.title})` : ''}
              </option>
            ))}
          </select>

          {selectedAuthor && (
            <div className="author-preview">
              {selectedAuthor.avatar && (
                <img src={selectedAuthor.avatar} alt={selectedAuthor.name} />
              )}
              <div className="author-info">
                <strong>{selectedAuthor.name}</strong>
                {selectedAuthor.title && <span>{selectedAuthor.title}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Hero Title */}
        <div className="form-group">
          <label className="form-label">Tiêu đề Banner</label>
          <input
            type="text"
            className="form-input"
            {...register('heroTitle')}
            placeholder="VD: Top 10 dịch vụ streaming tốt nhất 2026"
          />
          <span className="form-hint">Để trống sẽ dùng tên danh mục</span>
        </div>

        {/* Intro Content */}
        <div className="form-group full-width">
          <label className="form-label">Nội dung giới thiệu</label>
          <RichTextEditor
            value={watch('introContent') || ''}
            onChange={(value) => setValue('introContent', value, { shouldDirty: true })}
            placeholder="Viết phần giới thiệu danh mục tại đây..."
          />
          <span className="form-hint">Hiển thị bên dưới banner trên trang danh mục</span>
        </div>
      </div>

      <style jsx>{`
        .banner-section {
          margin-top: 20px;
        }

        .author-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .author-preview img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-info strong {
          font-size: 14px;
          color: #1a1a1a;
        }

        .author-info span {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
