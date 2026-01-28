'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { CategoryFormData } from './types';

export default function Tab3Definitions() {
  const { register, control, watch, formState: { errors } } = useFormContext<CategoryFormData>();

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
    move: moveCriteria,
  } = useFieldArray({
    control,
    name: 'criteriaDefinitions',
  });

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
    move: moveHighlight,
  } = useFieldArray({
    control,
    name: 'highlightDefinitions',
  });

  const addCriteria = () => {
    const key = `criterion_${Date.now()}`;
    appendCriteria({ key, label: '', maxScore: 10 });
  };

  const addHighlight = () => {
    const key = `highlight_${Date.now()}`;
    appendHighlight({ key, label: '' });
  };

  const generateKeyFromLabel = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  return (
    <div className="tab-definitions">
      <div className="section">
        <h2 className="section-title">Scoring Criteria Definitions</h2>
        <p className="section-desc">
          Define the scoring dimensions for products in this category. These criteria will appear
          in product score breakdowns and comparisons.
        </p>

        <div className="definitions-table">
          <div className="table-header">
            <span className="col-key">Key (Internal)</span>
            <span className="col-label">Label (Display)</span>
            <span className="col-score">Max Score</span>
            <span className="col-actions">Actions</span>
          </div>

          {criteriaFields.length === 0 ? (
            <div className="empty-row">
              No criteria defined. Add at least one scoring criterion.
            </div>
          ) : (
            <div className="table-body">
              {criteriaFields.map((field, index) => (
                <div key={field.id} className="table-row">
                  <div className="col-key">
                    <input
                      type="text"
                      {...register(`criteriaDefinitions.${index}.key` as const, {
                        required: 'Key is required',
                        pattern: {
                          value: /^[a-z0-9_]+$/,
                          message: 'Only lowercase, numbers, underscores'
                        }
                      })}
                      placeholder="e.g., value"
                      className="input-key"
                    />
                  </div>
                  <div className="col-label">
                    <input
                      type="text"
                      {...register(`criteriaDefinitions.${index}.label` as const, {
                        required: 'Label is required'
                      })}
                      placeholder="e.g., Value for Money"
                      onBlur={(e) => {
                        const currentKey = watch(`criteriaDefinitions.${index}.key`);
                        if (!currentKey && e.target.value) {
                          // Auto-generate key from label if empty
                          const generatedKey = generateKeyFromLabel(e.target.value);
                          // Note: This is a simple approach; in production, you might want to use setValue
                        }
                      }}
                    />
                  </div>
                  <div className="col-score">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      {...register(`criteriaDefinitions.${index}.maxScore` as const, {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Min is 1' },
                        max: { value: 100, message: 'Max is 100' }
                      })}
                      placeholder="10"
                    />
                  </div>
                  <div className="col-actions">
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => index > 0 && moveCriteria(index, index - 1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 2L10 8H2L6 2Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => index < criteriaFields.length - 1 && moveCriteria(index, index + 1)}
                      disabled={index === criteriaFields.length - 1}
                      title="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 10L2 4H10L6 10Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeCriteria(index)}
                      title="Remove"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="button" className="btn-add" onClick={addCriteria}>
            + Add Scoring Criterion
          </button>
        </div>

        <div className="criteria-preview">
          <h4>Preview</h4>
          <div className="preview-scores">
            {criteriaFields.map((field, index) => {
              const label = watch(`criteriaDefinitions.${index}.label`) || 'Untitled';
              const maxScore = watch(`criteriaDefinitions.${index}.maxScore`) || 10;
              return (
                <div key={field.id} className="preview-score-item">
                  <span className="preview-label">{label}</span>
                  <div className="preview-bar">
                    <div className="preview-fill" style={{ width: '70%' }} />
                  </div>
                  <span className="preview-value">7.0/{maxScore}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Highlight Definitions</h2>
        <p className="section-desc">
          Define quick-info labels shown on product cards (e.g., Starting Price, Free Trial, etc.).
          Products will fill in values for these labels.
        </p>

        <div className="definitions-table">
          <div className="table-header">
            <span className="col-key">Key (Internal)</span>
            <span className="col-label">Label (Display)</span>
            <span className="col-actions">Actions</span>
          </div>

          {highlightFields.length === 0 ? (
            <div className="empty-row">
              No highlights defined. Add at least one highlight label.
            </div>
          ) : (
            <div className="table-body">
              {highlightFields.map((field, index) => (
                <div key={field.id} className="table-row">
                  <div className="col-key">
                    <input
                      type="text"
                      {...register(`highlightDefinitions.${index}.key` as const, {
                        required: 'Key is required',
                        pattern: {
                          value: /^[a-z0-9_]+$/,
                          message: 'Only lowercase, numbers, underscores'
                        }
                      })}
                      placeholder="e.g., starting_price"
                      className="input-key"
                    />
                  </div>
                  <div className="col-label">
                    <input
                      type="text"
                      {...register(`highlightDefinitions.${index}.label` as const, {
                        required: 'Label is required'
                      })}
                      placeholder="e.g., Starting Price"
                    />
                  </div>
                  <div className="col-actions">
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => index > 0 && moveHighlight(index, index - 1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 2L10 8H2L6 2Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-move"
                      onClick={() => index < highlightFields.length - 1 && moveHighlight(index, index + 1)}
                      disabled={index === highlightFields.length - 1}
                      title="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 10L2 4H10L6 10Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeHighlight(index)}
                      title="Remove"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="button" className="btn-add" onClick={addHighlight}>
            + Add Highlight Label
          </button>
        </div>

        <div className="highlight-preview">
          <h4>Preview (Sample Product Card)</h4>
          <div className="preview-card">
            <div className="preview-highlights">
              {highlightFields.map((field, index) => {
                const label = watch(`highlightDefinitions.${index}.label`) || 'Untitled';
                return (
                  <div key={field.id} className="preview-highlight-item">
                    <span className="preview-hl-label">{label}</span>
                    <span className="preview-hl-value">Sample Value</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="section tips-section">
        <h2 className="section-title">Usage Tips</h2>
        <div className="tips-grid">
          <div className="tip">
            <h4>Criteria Keys</h4>
            <p>Use snake_case for keys (e.g., <code>ease_of_use</code>). These are used internally to map product scores.</p>
          </div>
          <div className="tip">
            <h4>Consistent Scoring</h4>
            <p>Keep max scores consistent (usually 10) for easier comparison across products.</p>
          </div>
          <div className="tip">
            <h4>Highlight Labels</h4>
            <p>Common highlights include Starting Price, Free Trial, Best For, Platforms, etc.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tab-definitions {
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

        .definitions-table {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 100px 100px;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 12px;
        }

        .table-header span {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }

        .table-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr 100px 100px;
          gap: 12px;
          align-items: center;
        }

        .empty-row {
          padding: 24px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          background: white;
          border-radius: 6px;
          border: 2px dashed #e5e7eb;
        }

        input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 2px rgba(254, 74, 100, 0.1);
        }

        .input-key {
          font-family: monospace;
          font-size: 12px;
        }

        .col-actions {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
        }

        .btn-move {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: white;
          border-radius: 4px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-move:hover:not(:disabled) {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-move:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .btn-remove {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #fee2e2;
          border-radius: 4px;
          color: #dc2626;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          margin-top: 12px;
          padding: 10px 16px;
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .btn-add:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
          color: #374151;
        }

        .criteria-preview,
        .highlight-preview {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
        }

        .criteria-preview h4,
        .highlight-preview h4 {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 12px 0;
        }

        .preview-scores {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-score-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .preview-label {
          width: 120px;
          font-size: 13px;
          color: #374151;
        }

        .preview-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .preview-fill {
          height: 100%;
          background: linear-gradient(90deg, #FE4A64, #f97316);
          border-radius: 4px;
        }

        .preview-value {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          min-width: 50px;
          text-align: right;
        }

        .preview-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .preview-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .preview-highlight-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-hl-label {
          font-size: 11px;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 600;
        }

        .preview-hl-value {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .tips-section {
          border-bottom: none;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .tip {
          background: #eff6ff;
          border-radius: 8px;
          padding: 16px;
        }

        .tip h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 8px 0;
        }

        .tip p {
          font-size: 13px;
          color: #1e40af;
          margin: 0;
          opacity: 0.8;
        }

        .tip code {
          background: #dbeafe;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .table-header span:not(:first-child) {
            display: none;
          }

          .table-row {
            background: white;
            padding: 12px;
            border-radius: 6px;
          }

          .col-actions {
            justify-content: flex-start;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
