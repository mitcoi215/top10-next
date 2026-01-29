'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { CategoryFormData, AuthorOption } from './types';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import dynamic from 'next/dynamic';

// Dynamic import for BottomContentEditor to avoid SSR issues
const BottomContentEditor = dynamic(
  () => import('../bottom-content-editor/BottomContentEditor'),
  {
    ssr: false,
    loading: () => <div className="p-4 bg-gray-50 text-gray-500">Loading editor...</div>,
  }
);

interface Tab4Props {
  authors: AuthorOption[];
}

export default function Tab4ReviewMethodology({ authors }: Tab4Props) {
  const { register, control, watch, setValue } = useFormContext<CategoryFormData>();

  const {
    fields: criteriaFields,
    append: appendCriterion,
    remove: removeCriterion,
  } = useFieldArray({
    control,
    name: 'methodologyCriteria',
  });

  const {
    fields: exploreFields,
    append: appendExplore,
    remove: removeExplore,
  } = useFieldArray({
    control,
    name: 'exploreCards',
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  return (
    <div className="tab-review-methodology">
      {/* Methodology Section */}
      <div className="section">
        <h2 className="section-title">Phương pháp đánh giá</h2>
        <p className="section-desc">Giải thích cách đánh giá sản phẩm</p>

        <div className="form-group full-width mb-20">
          <RichTextEditor
            label="Giới thiệu phương pháp"
            value={watch('methodologyIntro') || ''}
            onChange={(value) => setValue('methodologyIntro', value, { shouldDirty: true })}
            placeholder="Giải thích quy trình đánh giá của bạn..."
          />
        </div>

        <h3 className="subsection-title">Tiêu chí đánh giá</h3>
        <div className="dynamic-list">
          {criteriaFields.map((field, index) => (
            <div key={field.id} className="dynamic-item">
              <div className="item-content">
                <input
                  type="text"
                  {...register(`methodologyCriteria.${index}.title` as const)}
                  placeholder="Tên tiêu chí"
                  className="input-title"
                />
                <textarea
                  {...register(`methodologyCriteria.${index}.description` as const)}
                  placeholder="Mô tả cách đánh giá tiêu chí này..."
                  rows={2}
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeCriterion(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendCriterion({ title: '', description: '' })}
          >
            + Thêm tiêu chí đánh giá
          </button>
        </div>
      </div>

      {/* Explore Cards */}
      <div className="section">
        <h2 className="section-title">Thẻ khám phá thêm</h2>
        <p className="section-desc">Các thẻ nội dung liên quan ở cuối trang</p>

        <div className="dynamic-list explore-list">
          {exploreFields.map((field, index) => (
            <div key={field.id} className="explore-item">
              <div className="explore-content-grid">
                <div className="explore-row">
                  <div className="explore-field">
                    <label>Tiêu đề</label>
                    <input
                      type="text"
                      {...register(`exploreCards.${index}.title` as const)}
                      placeholder="Tiêu đề thẻ"
                    />
                  </div>
                  <div className="explore-field">
                    <label>Đường dẫn</label>
                    <input
                      type="text"
                      {...register(`exploreCards.${index}.href` as const)}
                      placeholder="/bai-viet/huong-dan"
                    />
                  </div>
                </div>
                <div className="explore-image-upload">
                  <ImageUpload
                    label="Ảnh thẻ"
                    value={watch(`exploreCards.${index}.image` as const) || ''}
                    onChange={(url) => setValue(`exploreCards.${index}.image` as const, url, { shouldDirty: true })}
                    placeholder="Tải lên hoặc nhập URL ảnh"
                    folder="categories/explore"
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeExplore(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendExplore({ title: '', href: '', image: '' })}
          >
            + Thêm thẻ khám phá
          </button>
        </div>
      </div>

      {/* Bottom Content (Comparison Table, Experts, etc.) */}
      <div className="section">
        <h2 className="section-title">Nội dung phía dưới</h2>
        <p className="section-desc">Xây dựng các khối nội dung cho bảng so sánh, phần chuyên gia, v.v. Hiển thị phía trên phần FAQ.</p>

        <BottomContentEditor
          value={watch('bottomContent') || ''}
          onChange={(value) => setValue('bottomContent', value, { shouldDirty: true })}
          authors={authors.map(a => ({
            id: a.id,
            name: a.name,
            avatar: a.avatar,
            title: a.title,
            slug: a.id, // Using id as slug fallback
          }))}
        />
      </div>

      {/* Additional Content (below Bottom Content) */}
      <div className="section">
        <h2 className="section-title">Nội dung bổ sung</h2>
        <p className="section-desc">Các khối nội dung bổ sung hiển thị bên dưới phần Nội dung phía dưới.</p>

        <BottomContentEditor
          value={watch('additionalContent') || ''}
          onChange={(value) => setValue('additionalContent', value, { shouldDirty: true })}
          authors={authors.map(a => ({
            id: a.id,
            name: a.name,
            avatar: a.avatar,
            title: a.title,
            slug: a.id,
          }))}
        />
      </div>

      {/* FAQs */}
      <div className="section">
        <h2 className="section-title">Câu hỏi thường gặp</h2>
        <p className="section-desc">Phần FAQ cho danh mục</p>

        <div className="dynamic-list">
          {faqFields.map((field, index) => (
            <div key={field.id} className="dynamic-item faq-item">
              <div className="item-content">
                <input
                  type="text"
                  {...register(`faqs.${index}.question` as const)}
                  placeholder="Câu hỏi"
                  className="input-title"
                />
                <textarea
                  {...register(`faqs.${index}.answer` as const)}
                  placeholder="Câu trả lời (hỗ trợ HTML)"
                  rows={3}
                />
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeFaq(index)}
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => appendFaq({ question: '', answer: '' })}
          >
            + Thêm câu hỏi
          </button>
        </div>
      </div>

      <style jsx>{`
        .tab-review-methodology {
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

        .subsection-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 20px 0 12px 0;
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

        .mb-20 {
          margin-bottom: 20px;
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

        input, textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
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
        }

        .dynamic-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dynamic-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          align-items: flex-start;
        }

        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-title {
          font-weight: 500;
        }

        .btn-remove {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 12px 16px;
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          color: #374151;
        }

        .explore-list .explore-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .explore-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .explore-content-grid {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .explore-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .explore-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .explore-field label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        .explore-field .optional {
          font-weight: 400;
          color: #9ca3af;
        }

        .explore-image-upload {
          margin-top: 8px;
        }

        .faq-item .item-content textarea {
          min-height: 80px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .explore-content {
            grid-template-columns: 1fr;
          }

          .explore-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
