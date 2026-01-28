'use client';

import { useFormContext } from 'react-hook-form';
import { ProductFormData, FaqItem } from './types';

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
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">FAQ section for the product review page (helps with SEO)</p>

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
                  <label>Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="e.g., How much does Sling TV cost?"
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Provide a detailed answer..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn-add" onClick={addFaq}>
            + Add FAQ
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">User Ratings Breakdown</h2>
        <p className="section-desc">Detailed user rating categories (optional)</p>

        <div className="ratings-grid">
          {['Overall', 'Features', 'Value', 'Ease of Use', 'Support'].map((category) => (
            <div key={category} className="rating-item">
              <label>{category}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="0-5"
                onChange={(e) => {
                  const currentRatings = watch('userRatings') || {};
                  setValue('userRatings', {
                    ...currentRatings,
                    [category.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0
                  });
                }}
                defaultValue={watch('userRatings')?.[category.toLowerCase().replace(/ /g, '_')] || ''}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">SEO Settings</h2>
        <p className="section-desc">Search engine optimization metadata</p>

        <div className="seo-actions">
          <button type="button" className="btn-generate" onClick={generateSeoFields}>
            🪄 Auto-generate SEO fields
          </button>
        </div>

        <div className="form-grid">
          {/* Meta Title */}
          <div className="form-group full-width">
            <label htmlFor="metaTitle">
              Meta Title
              <span className="tooltip" title="Title shown in search results (50-60 characters)">?</span>
            </label>
            <input
              id="metaTitle"
              type="text"
              {...register('metaTitle')}
              placeholder="e.g., Sling TV Review 2026: Features, Pricing & More | Top10"
            />
            <div className="char-count">
              {(watch('metaTitle') || '').length} / 60 characters
            </div>
          </div>

          {/* Meta Description */}
          <div className="form-group full-width">
            <label htmlFor="metaDescription">
              Meta Description
              <span className="tooltip" title="Description shown in search results (150-160 characters)">?</span>
            </label>
            <textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="A compelling description for search engines..."
              rows={3}
            />
            <div className="char-count">
              {(watch('metaDescription') || '').length} / 160 characters
            </div>
          </div>

          {/* OG Image */}
          <div className="form-group">
            <label htmlFor="ogImage">
              OG Image URL
              <span className="tooltip" title="Image shown when shared on social media">?</span>
            </label>
            <input
              id="ogImage"
              type="text"
              {...register('ogImage')}
              placeholder="/images/og/product-review.jpg"
            />
            {watch('ogImage') && (
              <div className="og-preview">
                <img src={watch('ogImage')} alt="OG preview" />
              </div>
            )}
          </div>

          {/* Canonical URL */}
          <div className="form-group">
            <label htmlFor="canonical">
              Canonical URL
              <span className="tooltip" title="Original URL if content exists elsewhere">?</span>
            </label>
            <input
              id="canonical"
              type="text"
              {...register('canonical')}
              placeholder="https://example.com/original-content"
            />
          </div>
        </div>

        {/* SEO Preview */}
        <div className="seo-preview">
          <h3>Search Result Preview</h3>
          <div className="preview-card">
            <div className="preview-url">
              top10.com › {watch('reviewHref') || 'product-review'}
            </div>
            <div className="preview-title">
              {watch('metaTitle') || 'Product Title | Top10'}
            </div>
            <div className="preview-desc">
              {watch('metaDescription') || 'Meta description will appear here...'}
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Related Products</h2>
        <p className="section-desc">Products to show in the &quot;Related&quot; section</p>

        <div className="form-group">
          <label>
            Related Product IDs
            <span className="tooltip" title="Comma-separated product IDs">?</span>
          </label>
          <input
            type="text"
            value={(watch('relatedProductIds') || []).join(', ')}
            onChange={(e) => {
              const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
              setValue('relatedProductIds', ids);
            }}
            placeholder="product-id-1, product-id-2, product-id-3"
          />
          <p className="hint">Enter product IDs separated by commas</p>
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

        .ratings-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .rating-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rating-item label {
          font-size: 12px;
          color: #6b7280;
        }

        .rating-item input {
          padding: 8px;
          text-align: center;
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
          .form-grid,
          .ratings-grid {
            grid-template-columns: 1fr;
          }

          .ratings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
