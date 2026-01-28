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
        <h2 className="section-title">Ranking & Display</h2>
        <p className="section-desc">How this product appears in the top 10 list</p>

        <div className="form-grid">
          {/* Rank */}
          <div className="form-group">
            <label htmlFor="rank">
              Rank Position <span className="required">*</span>
              <span className="tooltip" title="Position in the top 10 list (1-10)">?</span>
            </label>
            <input
              id="rank"
              type="number"
              min="1"
              max="10"
              {...register('rank', {
                required: 'Rank is required',
                min: { value: 1, message: 'Minimum rank is 1' },
                max: { value: 10, message: 'Maximum rank is 10' }
              })}
              className={errors.rank ? 'error' : ''}
            />
            {errors.rank && <span className="error-msg">{errors.rank.message}</span>}
          </div>

          {/* Ribbon */}
          <div className="form-group">
            <label htmlFor="ribbon">
              Ribbon Badge
              <span className="tooltip" title="Special badge like 'Best Overall', 'Editor's Choice'">?</span>
            </label>
            <select id="ribbon" {...register('ribbon')}>
              <option value="">No ribbon</option>
              <option value="Best Overall">Best Overall</option>
              <option value="Editor's Choice">Editor&apos;s Choice</option>
              <option value="Best Value">Best Value</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Rising Star">Rising Star</option>
            </select>
          </div>

          {/* Tagline */}
          <div className="form-group full-width">
            <label htmlFor="tagline">
              Tagline
              <span className="tooltip" title="Short catchy phrase under the product name">?</span>
            </label>
            <input
              id="tagline"
              type="text"
              {...register('tagline')}
              placeholder="e.g., Freedom to create customized plans"
            />
          </div>

          {/* Bottom Line */}
          <div className="form-group full-width">
            <label htmlFor="bottomLine">
              Bottom Line
              <span className="tooltip" title="Longer description shown in the comparison card">?</span>
            </label>
            <textarea
              id="bottomLine"
              {...register('bottomLine')}
              placeholder="Sling TV is a live TV streaming service known for its flexible channel packages..."
              rows={3}
            />
          </div>

          {/* Best For */}
          <div className="form-group">
            <label htmlFor="bestFor">
              Best For
              <span className="tooltip" title="Target audience or use case">?</span>
            </label>
            <input
              id="bestFor"
              type="text"
              {...register('bestFor')}
              placeholder="e.g., Budget-conscious cord cutters"
            />
          </div>

          {/* Base Price */}
          <div className="form-group">
            <label htmlFor="basePrice">
              Starting Price
              <span className="tooltip" title="Base price or price range">?</span>
            </label>
            <input
              id="basePrice"
              type="text"
              {...register('basePrice')}
              placeholder="e.g., $40/month, Free, $19.99"
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Scores & Ratings</h2>
        <p className="section-desc">Editorial scores for this product</p>

        <div className="form-grid">
          {/* Overall Score */}
          <div className="form-group">
            <label htmlFor="overallScore">
              Overall Score
              <span className="tooltip" title="Main score out of 10 (used for sorting)">?</span>
            </label>
            <input
              id="overallScore"
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...register('overallScore', { valueAsNumber: true })}
              placeholder="e.g., 9.2"
            />
          </div>

          {/* Score Label */}
          <div className="form-group">
            <label htmlFor="scoreLabel">
              Score Label
              <span className="tooltip" title="Text label for the score">?</span>
            </label>
            <select id="scoreLabel" {...register('scoreLabel')}>
              <option value="">Select label...</option>
              <option value="Excellent">Excellent (9.0+)</option>
              <option value="Very Good">Very Good (8.0-8.9)</option>
              <option value="Good">Good (7.0-7.9)</option>
              <option value="Fair">Fair (6.0-6.9)</option>
              <option value="Poor">Poor (&lt;6.0)</option>
            </select>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="scores-section">
          <h3>Detailed Scores (Category-specific)</h3>
          <p className="hint">These scores are defined by the category criteria</p>
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
        <h2 className="section-title">Highlights</h2>
        <p className="section-desc">Key information displayed prominently (3 items max)</p>

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
        <h2 className="section-title">Features List</h2>
        <p className="section-desc">Key features shown in the comparison card (checkmarks)</p>

        <div className="features-list">
          {featureFields.map((field, index) => (
            <div key={field.id} className="feature-item">
              <input
                type="text"
                {...register(`features.${index}.text` as const)}
                placeholder="Enter feature..."
              />
              <label className="bold-checkbox">
                <input
                  type="checkbox"
                  {...register(`features.${index}.bold` as const)}
                />
                Bold
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
            + Add Feature
          </button>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Customer Quote</h2>
        <p className="section-desc">Testimonial displayed in the product card</p>

        <div className="quote-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={!!quote}
              onChange={toggleQuote}
            />
            Include customer quote
          </label>
        </div>

        {quote && (
          <div className="quote-fields">
            <div className="form-group full-width">
              <label>Quote Text</label>
              <textarea
                value={quote.text}
                onChange={(e) => setValue('quote', { ...quote, text: e.target.value })}
                placeholder="Enter the customer quote..."
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Source Name</label>
              <input
                type="text"
                value={quote.source}
                onChange={(e) => setValue('quote', { ...quote, source: e.target.value })}
                placeholder="e.g., John D."
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={quote.date}
                onChange={(e) => setValue('quote', { ...quote, date: e.target.value })}
                placeholder="e.g., January 2026"
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
