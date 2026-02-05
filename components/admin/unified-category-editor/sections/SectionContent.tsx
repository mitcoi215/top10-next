'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CategoryFormData } from '../types';
import dynamic from 'next/dynamic';
import ImageUpload from '../../category-editor/ImageUpload';

const RichTextEditor = dynamic(() => import('../../category-editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

const BottomContentEditor = dynamic(() => import('../../bottom-content-editor/BottomContentEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

interface Author {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

interface SectionContentProps {
  authors: Author[];
}

export default function SectionContent({ authors }: SectionContentProps) {
  const { register, control, watch, setValue } = useFormContext<CategoryFormData>();
  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(new Set(['methodology']));

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

  const toggleSubsection = (id: string) => {
    setExpandedSubsections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="content-section">
      {/* Methodology Subsection */}
      <div className={`subsection ${expandedSubsections.has('methodology') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('methodology')}>
          <h3>📐 Phương pháp đánh giá</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('methodology') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('methodology') && (
          <div className="subsection-content">
            <div className="form-group">
              <label className="form-label">Giới thiệu phương pháp</label>
              <RichTextEditor
                value={watch('methodologyIntro') || ''}
                onChange={(value) => setValue('methodologyIntro', value, { shouldDirty: true })}
                placeholder="Giải thích quy trình đánh giá của bạn..."
              />
            </div>

            <div className="criteria-list">
              <label className="form-label">Tiêu chí đánh giá</label>
              {criteriaFields.map((field, index) => (
                <div key={field.id} className="criteria-item">
                  <input
                    type="text"
                    className="form-input"
                    {...register(`methodologyCriteria.${index}.title` as const)}
                    placeholder="Tên tiêu chí"
                  />
                  <textarea
                    className="form-textarea"
                    {...register(`methodologyCriteria.${index}.description` as const)}
                    placeholder="Mô tả cách đánh giá..."
                    rows={2}
                  />
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeCriterion(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-add-item"
                onClick={() => appendCriterion({ title: '', description: '' })}
              >
                + Thêm tiêu chí đánh giá
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Subsection */}
      <div className={`subsection ${expandedSubsections.has('faq') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('faq')}>
          <h3>❓ Câu hỏi thường gặp ({faqFields.length})</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('faq') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('faq') && (
          <div className="subsection-content">
            {faqFields.map((field, index) => (
              <div key={field.id} className="faq-item">
                <div className="faq-header">
                  <span className="faq-number">Q{index + 1}</span>
                  <button
                    type="button"
                    className="btn-remove-item small"
                    onClick={() => removeFaq(index)}
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  className="form-input"
                  {...register(`faqs.${index}.question` as const)}
                  placeholder="Câu hỏi"
                />
                <textarea
                  className="form-textarea"
                  {...register(`faqs.${index}.answer` as const)}
                  placeholder="Câu trả lời (hỗ trợ HTML)"
                  rows={3}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-add-item"
              onClick={() => appendFaq({ question: '', answer: '' })}
            >
              + Thêm câu hỏi
            </button>
          </div>
        )}
      </div>

      {/* Explore Cards Subsection */}
      <div className={`subsection ${expandedSubsections.has('explore') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('explore')}>
          <h3>🔗 Thẻ khám phá thêm ({exploreFields.length})</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('explore') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('explore') && (
          <div className="subsection-content">
            <p className="subsection-desc">Các thẻ nội dung liên quan hiển thị ở cuối trang</p>
            {exploreFields.map((field, index) => (
              <div key={field.id} className="explore-item">
                <div className="explore-row">
                  <div className="explore-field">
                    <label className="form-label-small">Tiêu đề</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register(`exploreCards.${index}.title` as const)}
                      placeholder="Tiêu đề thẻ"
                    />
                  </div>
                  <div className="explore-field">
                    <label className="form-label-small">Đường dẫn</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register(`exploreCards.${index}.href` as const)}
                      placeholder="/bai-viet/huong-dan"
                    />
                  </div>
                </div>
                <div className="explore-image">
                  <ImageUpload
                    label="Ảnh thẻ"
                    value={watch(`exploreCards.${index}.image`) || ''}
                    onChange={(url) => setValue(`exploreCards.${index}.image`, url, { shouldDirty: true })}
                    placeholder="Tải lên hoặc nhập URL ảnh"
                    folder="categories/explore"
                  />
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeExplore(index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add-item"
              onClick={() => appendExplore({ title: '', href: '', image: '' })}
            >
              + Thêm thẻ khám phá
            </button>
          </div>
        )}
      </div>

      {/* Bottom Content Subsection */}
      <div className={`subsection ${expandedSubsections.has('bottomContent') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('bottomContent')}>
          <h3>📄 Nội dung phía dưới</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('bottomContent') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('bottomContent') && (
          <div className="subsection-content">
            <p className="subsection-desc">
              Xây dựng các khối nội dung cho bảng so sánh, phần chuyên gia, v.v. Hiển thị phía trên phần FAQ.
            </p>
            <BottomContentEditor
              value={watch('bottomContent') || ''}
              onChange={(value) => setValue('bottomContent', value, { shouldDirty: true })}
              authors={authors.map(a => ({
                id: a.id,
                name: a.name,
                avatar: a.avatar,
                title: a.title,
                slug: a.id,
              }))}
            />
          </div>
        )}
      </div>

      {/* Additional Content Subsection */}
      <div className={`subsection ${expandedSubsections.has('additionalContent') ? 'expanded' : ''}`}>
        <div className="subsection-header" onClick={() => toggleSubsection('additionalContent')}>
          <h3>📑 Nội dung bổ sung</h3>
          <span className="subsection-toggle">
            {expandedSubsections.has('additionalContent') ? '▼' : '▶'}
          </span>
        </div>
        {expandedSubsections.has('additionalContent') && (
          <div className="subsection-content">
            <p className="subsection-desc">
              Các khối nội dung bổ sung hiển thị bên dưới phần Nội dung phía dưới.
            </p>
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
        )}
      </div>

      <style jsx>{`
        .content-section {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subsection {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .subsection.expanded {
          background: white;
        }

        .subsection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .subsection-header:hover {
          background: #f3f4f6;
        }

        .subsection-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .subsection-toggle {
          font-size: 12px;
          color: #9ca3af;
        }

        .subsection-content {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .criteria-list,
        .faq-list {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .criteria-item,
        .faq-item {
          position: relative;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-number {
          font-size: 12px;
          font-weight: 700;
          color: #FE4A64;
          background: #fff5f6;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .btn-remove-item {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          color: #dc2626;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-remove-item.small {
          position: static;
          width: 24px;
          height: 24px;
          font-size: 14px;
        }

        .btn-remove-item:hover {
          background: #fecaca;
        }

        .btn-add-item {
          padding: 12px;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-add-item:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .subsection-desc {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .explore-item {
          position: relative;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 12px;
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

        .form-label-small {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        .explore-image {
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
